const { test, expect } = require('@playwright/test');
const productId = 'a0dc4924-bce1-4043-a7de-7515f14646d2';
const otherId = 'a0dc4924-bce1-4043-a7de-7515f14646d3';
const conversationId = 'a0dc4924-bce1-4043-a7de-7515f14646d4';
const user = {
  id: 'test-user',
  username: 'customer',
  email: 'customer@example.com',
  role: 'CUSTOMER',
};
const product = {
  productID: productId,
  name: 'Test washer',
  SKU: 'TEST-W1',
  price: 100,
  stockQty: 3,
  images: [],
  category: { categoryID: otherId, name: 'Washers' },
  isActive: true,
  description: 'A washer for testing.',
  features: ['8 kg capacity'],
  boxContents: [],
  warranty: '',
  ratingAverage: 0,
  ratingCount: 0,
  brand: 'Samsung',
  subtitle: '',
  specifications: { Capacity: '8 kg' },
};

async function setup(page, signedIn = true) {
  await page.route('http://localhost:3000/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/auth/profile')
      return route.fulfill({
        status: signedIn ? 200 : 401,
        json: signedIn ? user : { message: 'Please sign in' },
      });
    if (
      url.pathname.startsWith('/products/') &&
      !url.pathname.includes('/reviews')
    )
      return route.fulfill({
        json: {
          ...product,
          productID: url.pathname.split('/')[2],
          name: url.pathname.includes(otherId) ? 'Other washer' : product.name,
        },
      });
    if (url.pathname === '/products') return route.fulfill({ json: [] });
    if (url.pathname === '/categories')
      return route.fulfill({ json: [product.category] });
    if (url.pathname.includes('/reviews'))
      return route.fulfill({
        json: {
          items: [],
          total: 0,
          page: 1,
          totalPages: 0,
          summary: { average: 0, count: 0, distribution: [] },
        },
      });
    return route.fulfill({ json: [] });
  });
  await page.goto(`/products/${productId}`);
  await expect(
    page.getByRole('button', { name: 'Ask about this product' }),
  ).toBeVisible();
}

test('product assistant asks guests to sign in and closes with Escape', async ({
  page,
}) => {
  await setup(page, false);
  await page.getByRole('button', { name: 'Ask about this product' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Sign in to ask a product question' }),
  ).toBeVisible();
  await expect(page.getByLabel('Your product question')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Ask about this product' }),
  ).toBeFocused();
});

test('sends only IDs and message, retains history, and renders text safely', async ({
  page,
}) => {
  await setup(page);
  const sent = [];
  await page.route('**/ai/chat', async (route) => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({
      status: 201,
      json: {
        conversationId,
        message: 'Stock: 3. <img src=x onerror=alert(1)>',
      },
    });
  });
  await page.getByRole('button', { name: 'Ask about this product' }).click();
  await expect(
    page.getByRole('button', { name: 'Send', exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('button', { name: 'Is this currently in stock?', exact: true })
    .click();
  await expect(page.getByRole('log')).toContainText(
    '<img src=x onerror=alert(1)>',
  );
  await expect(page.getByRole('log').locator('img')).toHaveCount(0);
  await page.getByLabel('Your product question').fill('What about warranty?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(
    page.getByRole('log').getByText('Stock: 3.', { exact: false }),
  ).toHaveCount(2);
  expect(sent[0]).toEqual({
    productId,
    message: 'Is this currently in stock?',
  });
  expect(sent[1]).toEqual({
    productId,
    conversationId,
    message: 'What about warranty?',
  });
  const dialog = await page.getByRole('dialog').boundingBox();
  const viewport = page.viewportSize();
  expect(dialog.x).toBeGreaterThanOrEqual(0);
  expect(dialog.y).toBeGreaterThanOrEqual(0);
  expect(dialog.x + dialog.width).toBeLessThanOrEqual(viewport.width);
  await page.screenshot({
    path: `test-results/ai-${viewport.width}.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await expect(page.getByRole('log')).toBeEmpty();
});

test('unavailable assistant retries once without duplicating the question', async ({
  page,
}) => {
  await setup(page);
  let requests = 0;
  await page.route('**/ai/chat', async (route) => {
    requests++;
    await route.fulfill(
      requests === 1
        ? { status: 503, json: { message: 'private provider error' } }
        : {
            status: 201,
            json: { conversationId, message: 'The product is in stock.' },
          },
    );
  });
  await page.getByRole('button', { name: 'Ask about this product' }).click();
  await page
    .getByRole('button', { name: 'Is this currently in stock?', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'temporarily unavailable',
  );
  await expect(page.getByRole('alert')).not.toContainText(
    'private provider error',
  );
  await expect(
    page.getByRole('heading', { name: product.name, exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByRole('log')).toContainText('The product is in stock.');
  await expect(
    page
      .getByRole('log')
      .getByText('Is this currently in stock?', { exact: true }),
  ).toHaveCount(1);
});
