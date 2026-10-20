const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');

let fixture;
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
});
test.afterAll(async () => cleanupShopFixture(fixture));

async function loginAdmin(page) {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(fixture.admin.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.admin.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto('/admin/orders');
}

test('admin manages an order and customer sees the persisted status', async ({
  page,
}) => {
  await fixture.customer.api.post('/cart/items', {
    data: { productId: fixture.washer.productID, quantity: 1 },
  });
  const createdResponse = await fixture.customer.api.post('/orders', {
    data: {
      idempotencyKey: randomUUID(),
      delivery: {
        firstName: 'Admin',
        lastName: 'Order Test',
        email: 'admin-order@example.com',
        phone: '0771234567',
        addressLine1: '10 Test Street',
        city: 'Colombo',
        postalCode: '00100',
        countryCode: 'LK',
      },
    },
  });
  expect(createdResponse.status()).toBe(201);
  const order = await createdResponse.json();
  await fixture.db.query('UPDATE orders SET status=$1 WHERE id=$2', [
    'CONFIRMED',
    order.id,
  ]);

  await loginAdmin(page);
  await expect(
    page.getByRole('heading', { name: 'Customer orders' }),
  ).toBeVisible();
  await expect(
    page.getByText(fixture.customer.username, { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible();
  await page
    .getByText(fixture.customer.username, { exact: true })
    .locator('xpath=ancestor::tr')
    .getByRole('link', { name: 'View order', exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/admin/orders/${order.id}$`));
  await expect(
    page.getByText(fixture.washer.name, { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Not initiated', { exact: true })).toBeVisible();
  await page
    .getByRole('button', { name: 'Save status: Processing', exact: true })
    .click();
  await expect(
    page.getByText('Order status updated successfully.'),
  ).toBeVisible();
  await expect(
    page
      .getByRole('list', { name: 'Order progress' })
      .getByText('Processing', { exact: true }),
  ).toBeVisible();
  const customerOrder = await fixture.customer.api.get(`/orders/${order.id}`);
  expect((await customerOrder.json()).status).toBe('PROCESSING');
});

test('admin order pages handle empty, missing and forbidden access', async ({
  page,
}) => {
  await loginAdmin(page);
  await page.goto(`/admin/orders/${randomUUID()}`);
  await expect(
    page.getByRole('heading', { name: 'Order not found' }),
  ).toBeVisible();
  if (
    !(await page
      .getByRole('button', { name: 'Sign out', exact: true })
      .isVisible())
  )
    await page.getByRole('banner').locator('summary').click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Username or email').fill(fixture.customer.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.customer.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto('/admin/orders');
  await expect(page).toHaveURL(/\/forbidden$/);
});
