const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
let fixture;
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
  fixture.keyword = fixture.categoryId.slice(0, 8);
  const updates = [
    [
      fixture.washer,
      {
        name: `Catalog ${fixture.keyword} Washer`,
        brand: 'Atlas',
        subtitle: '8 kg - White',
        price: 1200,
        compareAtPrice: 1500,
        badge: 'DEAL',
      },
    ],
    [
      fixture.kettle,
      {
        name: `Catalog ${fixture.keyword} Kettle`,
        brand: 'Nova',
        subtitle: '1.7 L - Black',
        price: 200,
        badge: 'NEW',
      },
    ],
  ];
  for (const [product, data] of updates) {
    expect(
      (
        await fixture.admin.api.patch(`/products/${product.productID}`, {
          data,
        })
      ).status(),
    ).toBe(200);
    Object.assign(product, data);
  }
  for (let index = 0; index < 13; index++) {
    const response = await fixture.admin.api.post('/products', {
      data: {
        name: `Catalog ${fixture.keyword} Extra ${String(index).padStart(2, '0')}`,
        SKU: `CAT-${fixture.keyword}-${index}`,
        price: 300 + index * 10,
        stockQty: index === 0 ? 0 : 5,
        categoryID: fixture.categoryId,
        brand: index % 2 ? 'Nova' : 'Atlas',
        subtitle: 'Everyday essentials',
        images: [],
      },
    });
    expect(response.status()).toBe(201);
    fixture.products.push((await response.json()).productID);
  }
});
test.afterAll(async () => cleanupShopFixture(fixture));
test.afterEach(async ({ page }) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true),
);
const categoryURL = () => `/products?category=${fixture.categoryId}`;
async function filters(page, info) {
  if (info.project.name === 'mobile') {
    const toggle = page.getByRole('button', { name: /Filters/ });
    if ((await toggle.getAttribute('aria-expanded')) === 'false')
      await toggle.click();
  }
  return page.getByRole('complementary', { name: 'Filters', exact: true });
}
test('catalog renders the reference layout with real counts, cards, and paging', async ({
  page,
}, info) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(categoryURL());
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–12 of 15 products',
  );
  await expect(page.locator('article')).toHaveCount(12);
  await filters(page, info);
  await expect(
    page
      .getByRole('complementary', { name: 'Filters' })
      .getByLabel('Atlas', { exact: false }),
  ).toBeVisible();
  await page.getByLabel('Sort by', { exact: true }).selectOption('price-desc');
  await expect(page.locator('article').first().getByRole('heading')).toHaveText(
    fixture.washer.name,
  );
  await expect(page.locator('article').first()).toContainText('LKR 1,500.00');
  await expect(page.locator('article').first()).toContainText('Deal');
  await page.screenshot({
    path: test.info().outputPath(`catalog-${info.project.name}.png`),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole('status')).toHaveText(
    'Showing 13–15 of 15 products',
  );
  await expect(page.locator('article')).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole('status')).toHaveText(
    'Showing 13–15 of 15 products',
  );
  await page.goBack();
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–12 of 15 products',
  );
  expect(errors).toEqual([]);
});
test('brand and price filters combine and remain in the URL', async ({
  page,
}, info) => {
  await page.goto(categoryURL());
  await expect(page.locator('article')).toHaveCount(12);
  let sidebar = await filters(page, info);
  await sidebar.getByLabel('Nova', { exact: false }).check();
  await expect(page).toHaveURL(/brands=Nova/);
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–7 of 7 products',
  );
  sidebar = await filters(page, info);
  await sidebar.getByLabel('Minimum price', { exact: true }).fill('250');
  await sidebar.getByLabel('Maximum price', { exact: true }).fill('350');
  await sidebar
    .getByRole('button', { name: 'Apply price', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–3 of 3 products',
  );
  await page.reload();
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–3 of 3 products',
  );
  await page
    .getByRole('button', { name: 'Remove filter: Nova', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText(
    'Showing 1–6 of 6 products',
  );
});
test('search, invalid filters, empty results, and retry work', async ({
  page,
}) => {
  await page.goto('/products?q=' + encodeURIComponent(fixture.kettle.name));
  await expect(page.locator('article')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: fixture.kettle.name, exact: true }),
  ).toBeVisible();
  await page.goto('/products?q=no-such-' + fixture.keyword);
  await expect(
    page.getByRole('heading', { name: 'No products found', exact: true }),
  ).toBeVisible();
  await page.goto('/products?minPrice=900&maxPrice=100');
  await expect(page.getByRole('alert')).toContainText(
    'These filters are invalid.',
  );
  await page.route('http://localhost:3001/products/catalog?**', (route) =>
    route.fulfill({ status: 503, json: { message: 'unavailable' } }),
  );
  await page.goto(categoryURL());
  await expect(page.getByRole('alert')).toContainText(
    'Unable to load products.',
  );
  await page.unroute('http://localhost:3001/products/catalog?**');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(12);
  await page.setViewportSize({ width: 320, height: 800 });
});
test('customer can add from a catalog card and unavailable products stay disabled', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(fixture.customer.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.customer.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(categoryURL() + '&sort=price-desc');
  await expect(page.locator('article')).toHaveCount(12);
  await page
    .getByRole('button', {
      name: `Add to cart: ${fixture.washer.name}`,
      exact: true,
    })
    .click();
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: /Cart/ }),
  ).toContainText('1');
  await page.goto(categoryURL() + '&sort=price-asc');
  await expect(
    page.getByRole('button', { name: 'Out of stock', exact: true }),
  ).toBeDisabled();
});
test('admin can maintain the metadata through the existing product editor', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(fixture.admin.username);
  await page
    .getByLabel('Password', { exact: true })
    .fill(fixture.admin.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(`/admin/products/${fixture.washer.productID}/edit`);
  await page
    .getByLabel('Brand (optional)', { exact: true })
    .fill('Atlas Studio');
  await page
    .getByLabel('Short description (optional)', { exact: true })
    .fill('8 kg - Silver');
  await page
    .getByLabel('Original price (optional)', { exact: true })
    .fill('1600');
  await page
    .getByLabel('Promotion label (optional)', { exact: true })
    .selectOption('HOT');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Product updated successfully.',
  );
  const result = await fixture.admin.api.get(
    `/products/admin/${fixture.washer.productID}`,
  );
  const product = await result.json();
  expect(product.brand).toBe('Atlas Studio');
  expect(product.badge).toBe('HOT');
  // Restore the shared fixture for other viewport projects.
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: {
      brand: 'Atlas',
      subtitle: '8 kg - White',
      compareAtPrice: 1500,
      badge: 'DEAL',
    },
  });
});
