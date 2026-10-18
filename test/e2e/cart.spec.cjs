const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
  backendUrl,
} = require('../helpers/shop-fixture.cjs');
let fixture;
let pageErrors = [];
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
});
test.afterAll(async () => {
  await cleanupShopFixture(fixture);
});
test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  expect((await fixture.customer.api.delete('/cart')).status()).toBe(200);
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}/stock`, {
    data: { stockQty: 3 },
  });
});
test.afterEach(() => expect(pageErrors).toEqual([]));
async function login(page, account = fixture.customer, destination = '/cart') {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(account.username);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(destination);
}
async function addProduct(page, product) {
  await page.goto(`/products/${product.productID}`);
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Added to your cart.' }),
  ).toBeVisible();
}
const row = (page, product) =>
  page.getByRole('listitem').filter({
    has: page.getByRole('heading', { name: product.name, exact: true }),
  });
const summary = (page) =>
  page.getByRole('complementary', { name: 'Cart summary' });
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

test('customer adds products and manages the cart against the real backend', async ({
  page,
}, info) => {
  await page.goto('/cart');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Username or email').fill(fixture.customer.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.customer.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(
    page.getByRole('heading', { name: 'Your cart is empty' }),
  ).toBeVisible();
  await addProduct(page, fixture.washer);
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Add to cart', exact: true }),
  ).toBeEnabled();
  await page.getByRole('link', { name: 'View cart', exact: true }).click();
  const washer = row(page, fixture.washer);
  await expect(washer).toBeVisible();
  await expect(washer.getByText('LKR 1,234.50', { exact: true })).toBeVisible();
  await expect(
    summary(page).getByText('LKR 2,469.00', { exact: true }).last(),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: info.outputPath('cart-populated.png'),
    fullPage: true,
  });
  await washer
    .getByRole('button', {
      name: `Increase quantity for ${fixture.washer.name}`,
    })
    .click();
  await expect(
    summary(page).getByText('LKR 3,703.50', { exact: true }).last(),
  ).toBeVisible();
  await expect(
    washer.getByRole('button', {
      name: `Increase quantity for ${fixture.washer.name}`,
    }),
  ).toBeDisabled();
  await washer
    .getByRole('button', {
      name: `Decrease quantity for ${fixture.washer.name}`,
    })
    .click();
  await expect(
    summary(page).getByText('LKR 2,469.00', { exact: true }).last(),
  ).toBeVisible();
  await washer
    .getByRole('button', {
      name: `Decrease quantity for ${fixture.washer.name}`,
    })
    .click();
  await expect(
    washer.getByRole('button', {
      name: `Decrease quantity for ${fixture.washer.name}`,
    }),
  ).toBeDisabled();
  await addProduct(page, fixture.kettle);
  await page.getByRole('link', { name: 'View cart', exact: true }).click();
  await expect(
    summary(page).getByText('LKR 1,234.60', { exact: true }).last(),
  ).toBeVisible();
  await row(page, fixture.washer)
    .getByRole('button', { name: `Remove ${fixture.washer.name}`, exact: true })
    .click();
  await expect(
    summary(page).getByText('LKR 0.10', { exact: true }).last(),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(row(page, fixture.kettle)).toBeVisible();
  await page.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await page
    .getByRole('alert')
    .getByRole('button', { name: 'Clear cart', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your cart is empty' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Your cart is empty' }),
  ).toBeVisible();
  expect(
    (
      await (
        await fixture.customer.api.get('/products/' + fixture.washer.productID)
      ).json()
    ).stockQty,
  ).toBe(3);
  await noOverflow(page);
});

test('loading, saving, API failures and retry keep the page usable', async ({
  page,
}) => {
  await fixture.customer.api.post('/cart/items', {
    data: { productId: fixture.washer.productID, quantity: 1 },
  });
  await login(page);
  let releaseRead;
  const readGate = new Promise((resolve) => {
    releaseRead = resolve;
  });
  await page.route(`${backendUrl}/cart`, async (route) => {
    await readGate;
    await route.continue();
  });
  await page.reload();
  await expect(
    page.getByText('Loading your cart...', { exact: true }),
  ).toBeVisible();
  releaseRead();
  await expect(row(page, fixture.washer)).toBeVisible();
  await page.unroute(`${backendUrl}/cart`);
  let releaseWrite;
  const writeGate = new Promise((resolve) => {
    releaseWrite = resolve;
  });
  await page.route(`${backendUrl}/cart/items/*`, async (route) => {
    await writeGate;
    await route.continue();
  });
  const increase = page.getByRole('button', {
    name: `Increase quantity for ${fixture.washer.name}`,
  });
  await increase.click();
  await expect(page.getByText('Updating...', { exact: true })).toBeVisible();
  await expect(increase).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Clear cart', exact: true }),
  ).toBeDisabled();
  releaseWrite();
  await expect(
    summary(page).getByText('LKR 2,469.00', { exact: true }).last(),
  ).toBeVisible();
  await page.unroute(`${backendUrl}/cart/items/*`);
  await page.route(`${backendUrl}/cart/items/*`, (route) =>
    route.abort('failed'),
  );
  await increase.click();
  await expect(page.getByRole('alert')).toContainText(
    'Unable to update your cart. Please try again.',
  );
  await expect(increase).toBeEnabled();
  await expect(
    summary(page).getByText('LKR 2,469.00', { exact: true }).last(),
  ).toBeVisible();
  await page.unroute(`${backendUrl}/cart/items/*`);
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.route(`${backendUrl}/cart`, (route) => route.abort('failed'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(
    'Unable to load your cart. Please try again.',
  );
  await page.unroute(`${backendUrl}/cart`);
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(row(page, fixture.washer)).toBeVisible();
  await noOverflow(page);
});

test('real stock errors refresh cart availability without changing inventory', async ({
  page,
}) => {
  await fixture.customer.api.post('/cart/items', {
    data: { productId: fixture.washer.productID, quantity: 1 },
  });
  await login(page);
  await expect(row(page, fixture.washer)).toBeVisible();
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}/stock`, {
    data: { stockQty: 1 },
  });
  await page
    .getByRole('button', {
      name: `Increase quantity for ${fixture.washer.name}`,
    })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Requested quantity exceeds available stock',
  );
  await expect(
    page.getByRole('button', {
      name: `Increase quantity for ${fixture.washer.name}`,
    }),
  ).toBeDisabled();
  await expect(
    summary(page).getByText('LKR 1,234.50', { exact: true }).last(),
  ).toBeVisible();
});

test('guest and admin access reuse existing authentication and role handling', async ({
  page,
}) => {
  await page.goto(`/products/${fixture.washer.productID}`);
  await page
    .getByRole('link', { name: 'Sign in to shop', exact: true })
    .click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Username or email').fill(fixture.admin.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.admin.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/cart');
  await expect(page).toHaveURL(/\/forbidden$/);
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Cart', exact: true }),
  ).toHaveCount(0);
});

test('suggested products refresh the cart and allow checkout', async ({
  page,
}) => {
  await fixture.customer.api.post('/cart/items', {
    data: { productId: fixture.washer.productID, quantity: 1 },
  });
  await login(page);
  const suggestions = page.getByRole('region', { name: 'You Might Also Like' });
  const add = suggestions
    .getByRole('button', { name: /^Add to cart:/ })
    .first();
  await expect(add).toBeVisible();
  const productName = (await add.getAttribute('aria-label')).replace(
    'Add to cart: ',
    '',
  );
  await add.click();
  await expect(
    page.getByRole('listitem').filter({
      has: page.getByRole('heading', { name: productName, exact: true }),
    }),
  ).toBeVisible();
  expect(
    (await (await fixture.customer.api.get('/cart')).json()).itemCount,
  ).toBe(2);
  await noOverflow(page);
  await summary(page)
    .getByRole('link', { name: /Proceed to checkout/i })
    .click();
  await expect(page).toHaveURL(/\/checkout$/);
});
