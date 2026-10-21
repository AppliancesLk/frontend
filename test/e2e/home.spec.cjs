const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
const fs = require('node:fs/promises');
const path = require('node:path');
let fixture, original, imagePath;
let uiImages = [];
const slide = {
  imageUrl: '',
  alt: 'Home promotion artwork',
  title: 'Everyday upgrades',
  description: 'Explore the collection.',
  buttonText: 'Explore products',
  href: '/products',
};
test.beforeAll(async ({ playwright }) => {
  uiImages = [];
  fixture = await createShopFixture(playwright);
  original = (await fixture.db.query('SELECT * FROM banner_sections')).rows;
  const upload = await fixture.admin.api.post('/banners/images', {
    multipart: {
      image: {
        name: 'banner.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVQImWO4/eofAAVnAsTCwYPmAAAAAElFTkSuQmCC',
          'base64',
        ),
      },
    },
  });
  expect(upload.status()).toBe(201);
  slide.imageUrl = (await upload.json()).imageUrl;
  imagePath = path.resolve(
    __dirname,
    '../../../backend/uploads/banners',
    slide.imageUrl.split('/').pop(),
  );
  for (const position of ['top', 'middle', 'bottom-one', 'bottom-two']) {
    expect(
      (
        await fixture.admin.api.put(`/banners/${position}`, {
          data: {
            visible: position === 'top',
            slides:
              position === 'top'
                ? [slide, { ...slide, title: 'Second promotion' }]
                : [],
          },
        })
      ).status(),
    ).toBe(200);
  }
});
test.afterAll(async () => {
  try {
    if (original)
      for (const section of original)
        await fixture.db.query(
          'UPDATE banner_sections SET visible=$1, slides=$2, "updatedAt"=$3 WHERE position=$4',
          [
            section.visible,
            JSON.stringify(section.slides),
            section.updatedAt,
            section.position,
          ],
        );
    if (imagePath) await fs.unlink(imagePath);
    for (const filename of uiImages)
      await fs.unlink(
        path.resolve(__dirname, '../../../backend/uploads/banners', filename),
      );
  } finally {
    await cleanupShopFixture(fixture);
  }
});
async function login(page, account, destination) {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(account.username);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto(destination);
}
test('banner API enforces permissions, validation, persistence, and limits', async ({
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://localhost:3001',
    extraHTTPHeaders: {
      'X-Requested-With': 'XMLHttpRequest',
      Origin: 'http://localhost:5174',
    },
  });
  try {
    expect((await anonymous.get('/banners/admin/all')).status()).toBe(401);
    expect(
      (
        await anonymous.put('/banners/top', {
          data: { visible: false, slides: [] },
        })
      ).status(),
    ).toBe(401);
    expect(
      (
        await anonymous.post('/banners/images', {
          multipart: {
            image: {
              name: 'x.png',
              mimeType: 'image/png',
              buffer: Buffer.from('invalid'),
            },
          },
        })
      ).status(),
    ).toBe(401);
    expect(
      (
        await anonymous.get(
          '/banners/images/00000000-0000-4000-8000-000000000000.png',
        )
      ).status(),
    ).toBe(404);
  } finally {
    await anonymous.dispose();
  }
  expect((await fixture.customer.api.get('/banners/admin/all')).status()).toBe(
    403,
  );
  expect(
    (
      await fixture.customer.api.put('/banners/top', {
        data: { visible: false, slides: [] },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await fixture.customer.api.post('/banners/images', {
        multipart: {
          image: {
            name: 'x.png',
            mimeType: 'image/png',
            buffer: Buffer.from('invalid'),
          },
        },
      })
    ).status(),
  ).toBe(403);
  for (const [position, slides] of [
    ['top', Array(5).fill(slide)],
    ['middle', [slide, slide]],
    ['bottom-one', [slide, slide]],
    ['bottom-two', [slide, slide]],
  ])
    expect(
      (
        await fixture.admin.api.put(`/banners/${position}`, {
          data: { visible: true, slides },
        })
      ).status(),
    ).toBe(400);
  expect(
    (
      await fixture.admin.api.put('/banners/top', {
        data: {
          visible: true,
          slides: [{ ...slide, href: 'javascript:alert(1)' }],
        },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await fixture.admin.api.put('/banners/top', {
        data: { visible: true, slides: [] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await fixture.admin.api.put('/banners/unknown', {
        data: { visible: false, slides: [] },
      })
    ).status(),
  ).toBe(404);
  const rejected = await fixture.admin.api.post('/banners/images', {
    multipart: {
      image: {
        name: 'x.png',
        mimeType: 'image/png',
        buffer: Buffer.from('<svg></svg>'),
      },
    },
  });
  expect(rejected.status()).toBe(400);
  const persisted = await fixture.db.query(
    "SELECT slides FROM banner_sections WHERE position='top'",
  );
  expect(persisted.rows[0].slides).toHaveLength(2);
  const visible = await fixture.admin.api.get('/banners');
  expect((await visible.json()).map((section) => section.position)).toEqual([
    'top',
  ]);
});
test('homepage carousel, category navigation, search, and responsive layout', async ({
  page,
}, info) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Everyday upgrades' }),
  ).toBeVisible();
  await expect(page.locator('.campaign-hero').getByRole('button')).toHaveCount(0);
  await page.clock.fastForward(3500);
  await expect(
    page.getByRole('heading', { name: 'Second promotion' }),
  ).toBeVisible();
  await page.clock.fastForward(3500);
  await expect(
    page.getByRole('heading', { name: 'Everyday upgrades' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath(`home-${info.project.name}.png`),
    fullPage: true,
  });
  await page
    .getByRole('link', {
      name: await fixture.admin.api
        .get(`/categories/${fixture.categoryId}`)
        .then((r) => r.json())
        .then((c) => c.name),
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(new RegExp(`category=${fixture.categoryId}`));
  await expect(
    page.getByRole('heading', { name: fixture.washer.name, exact: true }),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search products', exact: true })
    .fill(fixture.kettle.name);
  await page
    .getByRole('button', { name: 'Search products', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: fixture.kettle.name, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: fixture.washer.name, exact: true }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
test('customer add-to-cart updates navigation badge', async ({ page }) => {
  await login(page, fixture.customer, '/');
  // Fixtures may appear beyond the homepage selection when the database already has many products.
  await page.goto(`/products/${fixture.washer.productID}`);
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(
    page.getByRole('banner').getByRole('link', { name: /Cart/ }),
  ).toContainText('1');
});
test('admin edits a banner and hides it from the storefront', async ({
  page,
}, info) => {
  await login(page, fixture.admin, '/admin/banners');
  const middle = page.locator('form').filter({
    has: page.getByRole('heading', { name: 'Middle banner', exact: true }),
  });
  await middle.getByRole('button', { name: /Add image/ }).click();
  await middle.getByLabel('Upload image', { exact: true }).setInputFiles({
    name: 'homepage-upload.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVQImWO4/eofAAVnAsTCwYPmAAAAAElFTkSuQmCC',
      'base64',
    ),
  });
  await expect(middle.getByLabel('Image URL', { exact: true })).toHaveValue(
    /\/banners\/images\/.+\.png$/,
  );
  uiImages.push(
    (await middle.getByLabel('Image URL', { exact: true }).inputValue())
      .split('/')
      .pop(),
  );
  await middle
    .getByLabel('Image description (alt text)')
    .fill('Middle promotion');
  await middle
    .getByLabel('Headline (optional)')
    .fill('Middle promotion headline');
  await middle.getByLabel('Show section').check();
  await middle
    .getByRole('button', { name: 'Save section', exact: true })
    .click();
  await expect(middle.getByRole('status')).toHaveText('Section saved.');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath(`admin-banners-${info.project.name}.png`),
    fullPage: true,
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Middle promotion headline' }),
  ).toBeVisible();
  await page.goto('/admin/banners');
  const middleAgain = page.locator('form').filter({
    has: page.getByRole('heading', { name: 'Middle banner', exact: true }),
  });
  await middleAgain.getByLabel('Show section').uncheck();
  await middleAgain
    .getByRole('button', { name: 'Save section', exact: true })
    .click();
  await expect(middleAgain.getByRole('status')).toHaveText('Section saved.');
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Shop by category' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Middle promotion headline' }),
  ).toHaveCount(0);
});

test('homepage handles failed and empty API responses', async ({ page }) => {
  await page.route('http://localhost:3001/products', (route) =>
    route.fulfill({ status: 503, json: { message: 'unavailable' } }),
  );
  await page.route('http://localhost:3001/banners', (route) =>
    route.fulfill({ status: 503, json: { message: 'unavailable' } }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText(
    'Unable to load this section.',
  );
  await expect(page.getByRole('alert')).toContainText(
    'Promotions are temporarily unavailable.',
  );
  await page.unroute('http://localhost:3001/products');
  await page.unroute('http://localhost:3001/banners');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Everyday upgrades' }),
  ).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.route('http://localhost:3001/products', (route) =>
    route.fulfill({ json: [] }),
  );
  await page.goto('/');
  await expect(
    page.getByText('There are no products to show yet.', { exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
