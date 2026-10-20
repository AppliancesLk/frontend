const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const {
  createShopFixture,
  cleanupShopFixture,
  backendUrl,
} = require('../helpers/shop-fixture.cjs');

test('all workspaces fit the supported viewports and retain working overlays', async ({
  browser,
  playwright,
}, testInfo) => {
  const fixture = await createShopFixture(playwright);
  const contexts = [];
  let repairerApi;
  try {
    const repairResponse = await fixture.customer.api.post('/repairs', {
      data: {
        device: {
          deviceType: 'Washing machine',
          brand: 'Review',
          model: 'Front loader',
        },
        problemDescription:
          'The appliance needs an inspection because it stops during operation.',
      },
    });
    expect(repairResponse.status()).toBe(201);
    const repair = await repairResponse.json();
    await fixture.customer.api.post('/cart/items', {
      data: { productId: fixture.washer.productID, quantity: 1 },
    });
    const orderResponse = await fixture.customer.api.post('/orders', {
      data: {
        idempotencyKey: randomUUID(),
        delivery: {
          firstName: 'UI',
          lastName: 'Review',
          email: 'ui@example.com',
          phone: '0771234567',
          addressLine1: '10 Review Street',
          city: 'Colombo',
          postalCode: '00100',
          countryCode: 'LK',
        },
      },
    });
    expect(orderResponse.status()).toBe(201);
    const order = await orderResponse.json();
    await fixture.customer.api.post('/cart/items', {
      data: { productId: fixture.washer.productID, quantity: 1 },
    });
    await fixture.customer.api.post('/chats', { data: {} });
    repairerApi = await playwright.request.newContext({
      baseURL: backendUrl,
      extraHTTPHeaders: {
        Origin: 'http://localhost:5174',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const repairerResponse = await repairerApi.post('/auth/register', {
      data: {
        username: 'ui_repair_' + randomUUID().slice(0, 8),
        email: randomUUID() + '@example.com',
        password: randomUUID(),
      },
    });
    expect(repairerResponse.status()).toBe(201);
    const repairer = (await repairerResponse.json()).user;
    fixture.users.push(repairer.id);
    await fixture.db.query('UPDATE users SET role=$1 WHERE id=$2', [
      'REPAIRER',
      repairer.id,
    ]);
    const groups = [
      {
        role: 'public',
        api: null,
        paths: [
          '/',
          '/products',
          `/products/${fixture.washer.productID}`,
          '/login',
          '/register',
          '/forbidden',
          '/page-not-found',
        ],
      },
      {
        role: 'customer',
        api: fixture.customer.api,
        paths: [
          '/cart',
          '/checkout',
          '/orders',
          `/orders/${order.id}`,
          '/repairs',
          '/repairs/request',
          `/repairs/${repair.id}`,
          '/account',
          '/support/chat',
        ],
      },
      {
        role: 'admin',
        api: fixture.admin.api,
        paths: [
          '/admin',
          '/admin/products',
          `/admin/products/${fixture.washer.productID}/edit`,
          '/admin/categories',
          '/admin/inventory',
          '/admin/orders',
          `/admin/orders/${order.id}`,
          '/admin/repairs',
          `/admin/repairs/${repair.id}`,
          '/admin/banners',
          '/admin/chats',
        ],
      },
      {
        role: 'repairer',
        api: repairerApi,
        paths: [
          '/repairer',
          '/repairer/repairs',
          `/repairer/repairs/${repair.id}`,
        ],
      },
    ];
    let pagesReviewed = 0;
    for (const group of groups) {
      if (
        process.env.UI_REVIEW_ROLES &&
        !process.env.UI_REVIEW_ROLES.split(',').includes(group.role)
      )
        continue;
      if (group.role === 'repairer')
        await fixture.db.query(
          'UPDATE repair_tickets SET "assignedRepairerId"=$1,status=$2 WHERE id=$3',
          [repairer.id, 'APPROVED', repair.id],
        );
      const context = await browser.newContext({
        storageState: group.api ? await group.api.storageState() : undefined,
      });
      contexts.push(context);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const width of (
        process.env.UI_REVIEW_WIDTHS ?? '320,375,390,430,768,1024,1440'
      )
        .split(',')
        .map(Number)) {
        await page.setViewportSize({ width, height: 1000 });
        for (const route of group.paths) {
          if (
            process.env.UI_REVIEW_PATHS &&
            !process.env.UI_REVIEW_PATHS.split(',').includes(route)
          )
            continue;
          console.log(group.role + ' ' + width + ' ' + route);
          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('main').first()).toBeVisible();
          await expect(
            page.getByRole('status').filter({ hasText: /^(Loading|Checking)/ }),
          ).toHaveCount(0);
          const overflow = await page.evaluate(() => ({
            width: innerWidth,
            scroll: document.documentElement.scrollWidth,
          }));
          expect(
            overflow.scroll,
            `${group.role} ${route} at ${width}px`,
          ).toBeLessThanOrEqual(overflow.width + 1);
          expect(errors, route).toEqual([]);
          await page.screenshot({
            path: testInfo.outputPath(
              group.role +
                '-' +
                route.replace(/[^a-z0-9]/gi, '_') +
                '-' +
                width +
                '.png',
            ),
            fullPage: true,
            animations: 'disabled',
            timeout: 15000,
          });
          pagesReviewed++;
        }
      }
      // Test the role-specific navigation drawer and keyboard dismissal.
      await page.setViewportSize({ width: 390, height: 844 });
      await page
        .getByRole('button', { name: 'Open menu', exact: true })
        .click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
      if (group.role === 'admin') {
        await page.goto(`/admin/repairs/${repair.id}`, {
          waitUntil: 'domcontentloaded',
        });
        await page
          .getByRole('button', { name: 'Reject repair', exact: true })
          .click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await page
          .getByRole('button', { name: 'Approve repair', exact: true })
          .click();
        await page
          .getByRole('dialog')
          .getByRole('button', { name: 'Confirm', exact: true })
          .click();
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect
          .poll(
            async () =>
              (
                await fixture.db.query(
                  'SELECT status FROM repair_tickets WHERE id=$1',
                  [repair.id],
                )
              ).rows[0].status,
          )
          .toBe('APPROVED');
      }
      if (group.role === 'repairer') {
        await page.goto(`/repairer/repairs/${repair.id}`, {
          waitUntil: 'domcontentloaded',
        });
        await page
          .getByRole('button', { name: 'Update Status', exact: true })
          .click();
        await page
          .getByRole('dialog')
          .getByRole('button', { name: /In progress/i })
          .click();
        await page
          .getByRole('dialog')
          .getByRole('button', { name: 'Update Status', exact: true })
          .click();
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect
          .poll(
            async () =>
              (
                await fixture.db.query(
                  'SELECT status FROM repair_tickets WHERE id=$1',
                  [repair.id],
                )
              ).rows[0].status,
          )
          .toBe('IN_PROGRESS');
      }
      await context.close();
    }
    console.log(
      `Reviewed ${pagesReviewed} route/viewport combinations with real API data.`,
    );
  } finally {
    for (const context of contexts) await context.close();
    if (fixture.users.length)
      await fixture.db.query(
        'DELETE FROM repair_tickets WHERE "customerId"=ANY($1::uuid[]) OR "assignedRepairerId"=ANY($1::uuid[])',
        [fixture.users],
      );
    await repairerApi?.dispose();
    await cleanupShopFixture(fixture);
  }
});

test('fallback hero, mobile filters and guest assistant use the shared design', async ({
  browser,
  playwright,
}, testInfo) => {
  const fixture = await createShopFixture(playwright);
  const context = await browser.newContext();
  try {
    await context.route('**/banners', (route) => route.fulfill({ json: [] }));
    const page = await context.newPage();
    for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(
        page.getByRole('heading', { name: 'Made for your everyday.' }),
      ).toBeVisible();
      await expect(
        page.getByRole('status').filter({ hasText: /^Loading/ }),
      ).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: testInfo.outputPath(`fallback-home-${width}.png`),
        animations: 'disabled',
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/products?category=' + fixture.categoryId, {
      waitUntil: 'domcontentloaded',
    });
    const filters = page.getByRole('button', { name: /Filters/ });
    await filters.click();
    await expect(
      page.getByRole('dialog', { name: 'Refine your search' }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(filters).toBeFocused();
    await page.goto('/products/' + fixture.washer.productID, {
      waitUntil: 'domcontentloaded',
    });
    await page.getByRole('button', { name: 'Ask about this product' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Product assistant' }),
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath('mobile-product-assistant.png'),
    });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  } finally {
    await context.close();
    await cleanupShopFixture(fixture);
  }
});
