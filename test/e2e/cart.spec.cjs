const { test, expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const { createRequire } = require('node:module');
const fs = require('node:fs');
const path = require('node:path');
const backendPath =
  process.env.CART_BACKEND_DIR || path.resolve(__dirname, '../../../backend');
const backendRequire = createRequire(path.join(backendPath, 'package.json'));
const { Client } = backendRequire('pg');
const { parse } = backendRequire('dotenv');
const backendUrl = process.env.CART_BACKEND_URL || 'http://localhost:3001';
const frontendUrl = process.env.CART_FRONTEND_URL || 'http://localhost:5174';
let fixture;
let pageErrors = [];

// Real API fixtures, isolated by random IDs. The DB is used only to provision a
// temporary admin and remove this test's records; browser operations use HTTP.
test.beforeAll(async ({ playwright }) => {
  const file = path.join(backendPath, '.env');
  const env = {
    ...(fs.existsSync(file) ? parse(fs.readFileSync(file)) : {}),
    ...process.env,
  };
  const db = new Client({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    connectionTimeoutMillis: 10000,
  });
  await db.connect();
  fixture = { db, users: [], products: [], categoryId: null };
  const suffix = randomBytes(6).toString('hex');
  const extraHTTPHeaders = {
    Origin: frontendUrl,
    'X-Requested-With': 'XMLHttpRequest',
  };
  const register = async (role) => {
    const api = await playwright.request.newContext({
      baseURL: backendUrl,
      extraHTTPHeaders,
    });
    const username = `cart_${role}_${suffix}`;
    const password = randomBytes(20).toString('hex');
    const result = await api.post('/auth/register', {
      data: { username, password, email: `${username}@example.com` },
    });
    expect(result.status()).toBe(201);
    const user = (await result.json()).user;
    fixture.users.push(user.id);
    return { api, username, password, id: user.id };
  };
  fixture.admin = await register('admin');
  fixture.customer = await register('customer');
  await db.query('UPDATE users SET role=$1 WHERE id=$2', [
    'ADMIN',
    fixture.admin.id,
  ]);
  const category = await fixture.admin.api.post('/categories', {
    data: { name: `Cart UI ${suffix}` },
  });
  expect(category.status()).toBe(201);
  fixture.categoryId = (await category.json()).categoryID;
  const createProduct = async (name, price, stockQty) => {
    const response = await fixture.admin.api.post('/products', {
      data: {
        name: `${name} ${suffix}`,
        SKU: `${name}-${suffix}`,
        price,
        stockQty,
        categoryID: fixture.categoryId,
        images: [],
      },
    });
    expect(response.status()).toBe(201);
    const product = await response.json();
    fixture.products.push(product.productID);
    return product;
  };
  fixture.washer = await createProduct('Cart test washer', 1234.5, 3);
  fixture.kettle = await createProduct('Cart test kettle', 0.1, 5);
});
test.afterAll(async () => {
  if (!fixture) return;
  try {
    for (const id of fixture.users)
      await fixture.db.query('DELETE FROM users WHERE id=$1', [id]);
    for (const id of fixture.products)
      await fixture.db.query('DELETE FROM products WHERE "productID"=$1', [id]);
    if (fixture.categoryId)
      await fixture.db.query('DELETE FROM categories WHERE "categoryID"=$1', [
        fixture.categoryId,
      ]);
  } finally {
    await fixture.admin?.api.dispose();
    await fixture.customer?.api.dispose();
    await fixture.db.end();
  }
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
    summary(page).getByText('LKR 2,469.00', { exact: true }),
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
    summary(page).getByText('LKR 3,703.50', { exact: true }),
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
    summary(page).getByText('LKR 2,469.00', { exact: true }),
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
    summary(page).getByText('LKR 1,234.60', { exact: true }),
  ).toBeVisible();
  await row(page, fixture.washer)
    .getByRole('button', { name: `Remove ${fixture.washer.name}`, exact: true })
    .click();
  await expect(
    summary(page).getByText('LKR 0.10', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(row(page, fixture.kettle)).toBeVisible();
  await page.getByRole('button', { name: 'Clear cart', exact: true }).click();
  await page
    .getByRole('button', { name: 'Clear cart', exact: true })
    .last()
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
    summary(page).getByText('LKR 2,469.00', { exact: true }),
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
    summary(page).getByText('LKR 2,469.00', { exact: true }),
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
    summary(page).getByText('LKR 1,234.50', { exact: true }),
  ).toBeVisible();
});

test('guest and admin access reuse existing authentication and role handling', async ({
  page,
}) => {
  await page.goto(`/products/${fixture.washer.productID}`);
  await page
    .getByRole('link', { name: 'Sign in to add to cart', exact: true })
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
    page.getByRole('link', { name: 'Cart', exact: true }),
  ).toHaveCount(0);
});
