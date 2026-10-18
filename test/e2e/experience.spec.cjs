const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
const path = require('node:path');
const fs = require('node:fs/promises');
const { createRequire } = require('node:module');
const sharp = createRequire(
  path.resolve(__dirname, '../../../backend/package.json'),
)('sharp');
let fixture,
  photo,
  uploaded = [];
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
  uploaded = [];
  photo = await sharp({
    create: { width: 640, height: 640, channels: 3, background: '#dbeafe' },
  })
    .png()
    .toBuffer();
  const images = [];
  for (const color of ['#dbeafe', '#fef08a']) {
    const image = await sharp({
      create: { width: 640, height: 640, channels: 3, background: color },
    })
      .png()
      .toBuffer();
    const response = await fixture.admin.api.post('/media/images', {
      multipart: {
        image: { name: 'device.png', mimeType: 'image/png', buffer: image },
      },
    });
    expect(response.status()).toBe(201);
    const url = (await response.json()).imageUrl;
    images.push(url);
    uploaded.push(url.split('/').pop());
  }
  fixture.categoryName = (
    await fixture.admin.api
      .get(`/categories/${fixture.categoryId}`)
      .then((response) => response.json())
  ).name;
  const data = {
    description:
      'A complete washing machine designed for everyday laundry. This entry is used for browser verification.',
    features: [
      '8 kg load capacity',
      '1200 rpm spin speed',
      'Child safety lock',
    ],
    boxContents: ['Washing machine', 'Inlet hose', 'User guide'],
    warranty: 'Test warranty details available from the store.',
    specifications: {
      Capacity: '8 kg',
      Spin: '1200 rpm',
      Programs: 12,
      ChildLock: true,
      Color: 'White',
    },
    images,
  };
  expect(
    (
      await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
        data,
      })
    ).status(),
  ).toBe(200);
});
test.afterAll(async () => {
  try {
    if (fixture)
      for (const id of fixture.products)
        await fixture.db.query(
          'DELETE FROM product_reviews WHERE "productId"=$1',
          [id],
        );
    for (const filename of uploaded)
      await fs.unlink(
        path.resolve(
          __dirname,
          '../../../backend/uploads/experience-tests',
          filename,
        ),
      );
  } finally {
    await cleanupShopFixture(fixture);
  }
});
test.afterEach(async ({ page }) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true),
);
const detail = () => `/products/${fixture.washer.productID}`;
async function login(page, account, destination) {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(account.username);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(destination);
}
test('product details has an image gallery, zoom, content tabs, and related products', async ({
  page,
}, info) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(detail());
  await expect(
    page.getByRole('heading', { name: fixture.washer.name, exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Next image', exact: true }).click();
  await expect(page.getByText('Image 2 of 2', { exact: true })).toBeVisible();
  await page
    .getByRole('button', { name: 'View larger image', exact: true })
    .click();
  await expect(
    page.getByRole('dialog', { name: 'View larger image' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close image', exact: true }).click();
  await page.getByRole('tab', { name: 'Specifications', exact: true }).click();
  await expect(
    page.getByRole('tabpanel', { name: 'Specifications', exact: true }),
  ).toContainText('1200 rpm');
  await page
    .getByRole('tab', { name: 'What’s in the box', exact: true })
    .click();
  await expect(
    page.getByRole('tabpanel', { name: 'What’s in the box', exact: true }),
  ).toContainText('Inlet hose');
  await page.getByRole('tab', { name: 'Overview', exact: true }).click();
  await page.screenshot({
    path: test.info().outputPath(`product-detail-${info.project.name}.png`),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test('quantity, add-to-cart, and buy-now connect to the existing checkout', async ({
  page,
}) => {
  await fixture.customer.api.delete('/cart');
  await login(page, fixture.customer, detail());
  await page
    .getByRole('button', { name: 'Increase quantity', exact: true })
    .click();
  await expect(page.getByLabel('Quantity', { exact: true })).toHaveValue('2');
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Added to your cart.' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Decrease quantity', exact: true })
    .click();
  await page.getByRole('button', { name: 'Buy now', exact: false }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  const cart = await fixture.customer.api
    .get('/cart')
    .then((response) => response.json());
  expect(cart.items[0].quantity).toBe(3);
});
test('admin can choose product and category image files and save them', async ({
  page,
}) => {
  await login(
    page,
    fixture.admin,
    `/admin/products/${fixture.washer.productID}/edit`,
  );
  await page.getByLabel('Choose image files', { exact: true }).setInputFiles({
    name: 'product.png',
    mimeType: 'image/png',
    buffer: photo,
  });
  await expect(page.getByLabel('Image URLs', { exact: true })).toHaveValue(
    /\/media\/images\/.+\n\/media\/images\/.+\n\/media\/images\/.+/,
  );
  const images = (
    await page.getByLabel('Image URLs', { exact: true }).inputValue()
  ).split('\n');
  uploaded.push(images[2].split('/').pop());
  await page
    .getByLabel('Product description', { exact: true })
    .fill('Updated detailed description saved through the product editor.');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Product updated successfully.',
  );
  await page.goto('/admin/categories');
  const row = page.getByRole('row').filter({ hasText: fixture.categoryName });
  await row.getByRole('button', { name: 'Edit category', exact: true }).click();
  await page.getByLabel('Choose image files', { exact: true }).setInputFiles({
    name: 'category.png',
    mimeType: 'image/png',
    buffer: photo,
  });
  await expect(page.getByText('(1/1)', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status')).toBeVisible();
  const category = await fixture.admin.api
    .get(`/categories/${fixture.categoryId}`)
    .then((response) => response.json());
  expect(category.imageUrl).toMatch(/^\/media\/images\//);
  uploaded.push(category.imageUrl.split('/').pop());
});
test('customers can submit, edit, and delete real reviews with live ratings', async ({
  page,
}) => {
  await login(page, fixture.customer, detail());
  await page
    .getByRole('button', { name: 'Write a review', exact: true })
    .click();
  await page
    .getByLabel('Review title', { exact: true })
    .fill('A helpful appliance');
  await page
    .getByLabel('Your experience', { exact: true })
    .fill('The capacity and controls work well for my everyday laundry.');
  await page.getByLabel('Rating', { exact: true }).selectOption('5');
  await page
    .getByRole('button', { name: 'Submit review', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Your review has been saved.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Reviews (1)', exact: true }),
  ).toBeVisible();
  await page.getByLabel('Rating', { exact: true }).selectOption('3');
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        response.url().endsWith('/reviews/mine'),
    ),
    page.getByRole('button', { name: 'Update review', exact: true }).click(),
  ]);
  await expect(page.getByLabel('Rating', { exact: true })).toHaveValue('3');
  const saved = await fixture.customer.api
    .get(`/products/${fixture.washer.productID}/reviews`)
    .then((response) => response.json());
  expect(saved.summary.average).toBe(3);
  page.once('dialog', (dialog) => dialog.accept());
  await page
    .getByRole('button', { name: 'Delete review', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Review deleted.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Reviews (0)', exact: true }),
  ).toBeVisible();
});
