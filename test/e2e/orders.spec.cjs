const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const {
  createShopFixture,
  cleanupShopFixture,
  backendUrl,
} = require('../helpers/shop-fixture.cjs');
let fixture;
const delivery = {
  firstName: 'Order',
  lastName: 'Customer',
  email: 'orders@example.com',
  phone: '0771234567',
  addressLine1: '123 Test Road',
  addressLine2: 'Unit 2',
  city: 'Colombo',
  postalCode: '00100',
  countryCode: 'LK',
};
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
});
test.afterAll(async () => {
  if (fixture)
    for (const id of fixture.users)
      await fixture.db.query('DELETE FROM orders WHERE "customerId"=$1', [id]);
  await cleanupShopFixture(fixture);
});
test.beforeEach(async ({ page }) => {
  await fixture.db.query('DELETE FROM orders WHERE "customerId"=$1', [
    fixture.customer.id,
  ]);
  await fixture.customer.api.delete('/cart');
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { name: fixture.washer.name, price: 1234.5, isActive: true },
  });
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(fixture.customer.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.customer.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
});
async function createOrder() {
  expect(
    (
      await fixture.customer.api.post('/cart/items', {
        data: { productId: fixture.washer.productID, quantity: 2 },
      })
    ).status(),
  ).toBe(201);
  const result = await fixture.customer.api.post('/orders', {
    data: { idempotencyKey: randomUUID(), delivery },
  });
  expect(result.status()).toBe(201);
  return result.json();
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}
test('real history, stored purchase details and refreshed status', async ({
  page,
}, info) => {
  const first = await createOrder();
  const second = await createOrder();
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { name: 'Changed catalog product', price: 9999, isActive: false },
  });
  if (info.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'Your orders', exact: true })
      .click();
  } else
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Your orders', exact: true })
      .click();
  await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible();
  const links = page.getByRole('link', { name: /^View order / });
  await expect(links).toHaveCount(2);
  await expect(links.first()).toHaveAttribute('href', `/orders/${second.id}`);
  await noOverflow(page);
  await page.screenshot({
    path: test.info().outputPath(`orders-${info.project.name}.png`),
    fullPage: true,
  });
  await page.getByRole('link', { name: `View order ${first.id}` }).click();
  await expect(
    page.getByRole('heading', { name: 'Order details' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: fixture.washer.name }),
  ).toBeVisible();
  await expect(page.getByText('LKR 1,234.50', { exact: true })).toBeVisible();
  await expect(page.getByText('123 Test Road', { exact: true })).toBeVisible();
  await expect(page.getByText('Unit 2', { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole('list', { name: 'Order progress' })
      .getByText('Pending payment', { exact: true }),
  ).toBeVisible();
  await fixture.db.query('UPDATE orders SET status=$1 WHERE id=$2', [
    'SHIPPED',
    first.id,
  ]);
  await page
    .getByRole('button', { name: 'Refresh order', exact: true })
    .click();
  await expect(
    page
      .getByRole('list', { name: 'Order progress' })
      .getByText('Shipped', { exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: test.info().outputPath(`order-details-${info.project.name}.png`),
    fullPage: true,
  });
  await page.reload();
  await expect(
    page
      .getByRole('list', { name: 'Order progress' })
      .getByText('Shipped', { exact: true }),
  ).toBeVisible();
});
test('empty, unknown and another customer order states', async ({ page }) => {
  await page.goto('/orders');
  await expect(
    page.getByRole('heading', { name: 'No orders yet' }),
  ).toBeVisible();
  const order = await createOrder();
  await fixture.db.query('UPDATE orders SET "customerId"=$1 WHERE id=$2', [
    fixture.admin.id,
    order.id,
  ]);
  for (const id of [randomUUID(), order.id, 'bad-id']) {
    await page.goto(`/orders/${id}`);
    await expect(
      page.getByRole('heading', { name: 'Order not found', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('123 Test Road', { exact: true })).toHaveCount(
      0,
    );
  }
});
test('loading, failed list and details reads can be retried', async ({
  page,
}) => {
  const order = await createOrder();
  for (const path of ['/orders', `/orders/${order.id}`]) {
    const url = `${backendUrl}${path}`;
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    await page.route(url, async (route) => {
      await gate;
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'private SQL error' }),
      });
    });
    await page.goto(path);
    await expect(
      page.getByRole('main').getByRole('heading', {
        name: path === '/orders' ? 'My orders' : 'Order details',
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole('main').getByRole('status')).toBeVisible();
    release();
    await expect(page.getByRole('alert')).toContainText(
      'Unable to load your orders',
    );
    await expect(page.getByText('private SQL error')).toHaveCount(0);
    await page.unroute(url);
    await page.getByRole('button', { name: 'Try again', exact: false }).click();
    await expect(
      (path === '/orders'
        ? page
        : page.getByRole('list', { name: 'Order progress' })
      ).getByText('Pending payment', { exact: true }),
    ).toBeVisible();
  }
});
test('protected routes reject logged-out users and other roles', async ({
  page,
}) => {
  if (
    !(await page
      .getByRole('button', { name: 'Sign out', exact: true })
      .isVisible())
  )
    await page.getByRole('banner').locator('summary').click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.goto(`/orders/${randomUUID()}`);
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Username or email').fill(fixture.admin.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.admin.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto('/orders');
  await expect(page).toHaveURL(/\/forbidden$/);
});
