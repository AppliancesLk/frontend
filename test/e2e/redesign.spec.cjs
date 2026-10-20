const { test, expect } = require('@playwright/test');
const id = '25da8243-ef71-40de-80bd-121426418bce';
const category = {
  categoryID: 'efeb008b-d853-4449-935b-140ae5765419',
  name: 'Home appliances',
  isActive: true,
  parent: null,
};
const product = {
  productID: id,
  name: 'Samsung front load washing machine',
  brand: 'Samsung',
  subtitle: '8 kg · White',
  SKU: 'WW80-TA046',
  price: '159990.00',
  stockQty: 4,
  images: ['/test-product.svg'],
  isActive: true,
  category,
  badge: 'NEW',
  ratingAverage: 4.5,
  ratingCount: 12,
  description:
    'Thoughtful care for everyday laundry. An efficient washing machine with room for the whole family.',
  specifications: {
    Capacity: '8 kg',
    Motor: 'Digital inverter',
    Programs: 12,
    Color: 'White',
  },
  features: ['Quiet operation', 'Child safety lock'],
  boxContents: ['Washing machine', 'Inlet hose'],
  warranty: 'Manufacturer warranty',
};
const second = {
  ...product,
  productID: '793b9e9c-7efc-4fe8-9e22-0f6c29f47928',
  name: 'Everyday cordless vacuum cleaner',
  brand: 'Nova',
  SKU: 'NOVA-V162',
  price: '53990.00',
  stockQty: 20,
  badge: null,
  images: [],
};
const customer = {
  id: 'customer-1',
  username: 'Lakshitha',
  email: 'lakshitha@example.com',
  role: 'CUSTOMER',
};
const order = {
  id: '4fdf3f72-c608-4bd4-8000-000000000001',
  status: 'SHIPPED',
  createdAt: '2026-10-20T04:56:00Z',
  updatedAt: '2026-10-20T04:56:00Z',
  subtotal: '159990.00',
  total: '159990.00',
  items: [
    {
      id: 'item-1',
      productId: id,
      name: product.name,
      SKU: product.SKU,
      images: product.images,
      quantity: 1,
      unitPrice: product.price,
      lineTotal: product.price,
    },
  ],
  delivery: null,
};
const repair = {
  id: 'repair-1',
  reference: 'RPR-20261020-E465D1AA',
  status: 'IN_PROGRESS',
  device: {
    deviceType: 'Washing machine',
    brand: 'Samsung',
    model: 'WW80-TA046',
    serialNumber: 'SN-1122',
  },
  problemDescription: 'The spin cycle is unusually noisy.',
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
};
const image =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect x="135" y="60" width="330" height="480" rx="18" fill="#fafbfb" stroke="#8a989c" stroke-width="4"/><path d="M135 155h330" stroke="#b3bec1" stroke-width="3"/><rect x="162" y="90" width="95" height="35" rx="4" fill="#e7ebec"/><circle cx="402" cy="106" r="19" fill="#d3dadc"/><rect x="281" y="94" width="76" height="24" rx="3" fill="#162024"/><circle cx="300" cy="335" r="122" fill="#39464a"/><circle cx="300" cy="335" r="104" fill="#162024"/><circle cx="300" cy="335" r="86" fill="#66767b"/><path d="M235 330q65 90 130 0" fill="#b3bec1"/><rect x="163" y="511" width="274" height="6" rx="3" fill="#d3dadc"/></svg>';

async function mockShop(page, role = null) {
  let user = role ? { ...customer, role } : null;
  let quantity = 1;
  const cart = () => ({
    id: 'cart-1',
    currency: 'LKR',
    itemCount: quantity,
    subtotal: (159990 * quantity).toFixed(2),
    items: quantity
      ? [
          {
            ...order.items[0],
            stockQty: 4,
            isAvailable: true,
            quantity,
            lineTotal: (159990 * quantity).toFixed(2),
          },
        ]
      : [],
  });
  await page.route('**/test-product.svg', (route) =>
    route.fulfill({ contentType: 'image/svg+xml', body: image }),
  );
  await page.route('http://localhost:3099/**', async (route) => {
    const request = route.request(),
      url = new URL(request.url()),
      path = url.pathname;
    const json = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': 'http://localhost:5180',
          'access-control-allow-credentials': 'true',
          'access-control-allow-headers': 'content-type,x-requested-with',
          'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
        },
        body: JSON.stringify(data),
      });
    if (request.method() === 'OPTIONS') return json({});
    if (path === '/auth/profile')
      return json(user ?? { message: 'Unauthorized' }, user ? 200 : 401);
    if (path === '/auth/login' || path === '/auth/register') {
      user = customer;
      return json({ user });
    }
    if (path === '/auth/logout') {
      user = null;
      return json({});
    }
    if (path === '/categories' || path === '/categories/admin/all')
      return json([category]);
    if (path === '/banners') return json([]);
    if (path.includes('/reviews/mine')) return json(null);
    if (path.includes('/reviews'))
      return json({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
        summary: {
          average: 4.5,
          count: 12,
          distribution: [1, 2, 3, 4, 5].map((rating) => ({
            rating,
            count: rating > 3 ? 6 : 0,
          })),
        },
      });
    if (path === '/products/catalog')
      return json({
        items: url.searchParams.get('q') === 'nothing' ? [] : [product, second],
        total: 2,
        page: 1,
        limit: 12,
        totalPages: 1,
        facets: {
          categories: [{ ...category, parentId: null, count: 2 }],
          brands: [
            { name: 'Samsung', count: 1 },
            { name: 'Nova', count: 1 },
          ],
          allCount: 2,
          price: { min: '53990.00', max: '159990.00' },
        },
      });
    if (path === `/products/${id}`) return json(product);
    if (path === '/products' || path === '/products/admin/all')
      return json([product, second]);
    if (path.startsWith('/cart/items')) {
      if (request.method() === 'POST')
        quantity += request.postDataJSON().quantity;
      if (request.method() === 'PATCH')
        quantity = request.postDataJSON().quantity;
      if (request.method() === 'DELETE') quantity = 0;
      return json(cart());
    }
    if (path === '/cart') {
      if (request.method() === 'DELETE') quantity = 0;
      return json(cart());
    }
    if (path === '/orders' || path === '/orders/admin') return json([order]);
    if (path === `/orders/${order.id}`) return json(order);
    if (path === '/repairs') return json([repair]);
    if (path === '/repairs/repair-1') return json(repair);
    if (path === '/chats')
      return json({ items: [], total: 0, page: 1, totalPages: 0 });
    return json({ message: 'No test fixture for ' + path }, 404);
  });
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

test('category navigation stays collapsed after scrolling stops', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await mockShop(page);
  await page.goto('/');
  await expect(page.locator('.home-repair')).toBeVisible();
  const result = await page.evaluate(async () => {
    const header = document.querySelector('.site-header');
    const changes = [];
    const observer = new MutationObserver(() =>
      changes.push({
        collapsed: header.classList.contains('is-collapsed'),
        y: scrollY,
      }),
    );
    observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    window.scrollTo({ top: 450, behavior: 'instant' });
    // Observe beyond the CSS transition: idle time must not change direction.
    await new Promise((resolve) => setTimeout(resolve, 900));
    observer.disconnect();
    return {
      changes,
      y: scrollY,
      collapsed: header.classList.contains('is-collapsed'),
    };
  });
  expect(
    result,
    'The bar must settle without moving the document or toggling itself',
  ).toMatchObject({ y: 450, collapsed: true });
  expect(result.changes).toHaveLength(1);
});

test('category navigation follows rapid wheel reversals without extra blinking', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.emulateMedia({
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });
  await mockShop(page);
  await page.goto('/');
  await expect(page.locator('.home-repair')).toBeVisible();
  const header = page.locator('.site-header');
  await page.evaluate(() => window.scrollTo({ top: 550, behavior: 'instant' }));
  await expect(header).toHaveClass(/is-collapsed/);
  await page.mouse.move(1000, 600);
  // Reverse before the 220ms animation finishes, as with a quick trackpad gesture.
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, -80);
    await expect(header).not.toHaveClass(/is-collapsed/);
    await page.mouse.wheel(0, 100);
    await expect(header).toHaveClass(/is-collapsed/);
  }
  const result = await page.evaluate(async () => {
    const header = document.querySelector('.site-header');
    let changes = 0;
    const observer = new MutationObserver(() => changes++);
    observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    // Small scroll noise and duplicate events must not reveal the bar.
    for (let i = 0; i < 12; i++) {
      window.scrollBy({ top: i % 2 ? 2 : -2, behavior: 'instant' });
      await new Promise(requestAnimationFrame);
      window.dispatchEvent(new Event('scroll'));
    }
    const y = scrollY;
    await new Promise((resolve) => setTimeout(resolve, 500));
    observer.disconnect();
    return {
      changes,
      y,
      finalY: scrollY,
      collapsed: header.classList.contains('is-collapsed'),
    };
  });
  expect(result.changes).toBe(0);
  expect(result.collapsed).toBe(true);
  expect(result.finalY).toBe(result.y);
  await page.mouse.wheel(0, -100);
  await expect(header).not.toHaveClass(/is-collapsed/);
});

test('category navigation is stable near the collapse threshold and at the page edges', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await mockShop(page);
  await page.goto('/');
  await expect(page.locator('.home-repair')).toBeVisible();
  const header = page.locator('.site-header');
  await page.evaluate(() => window.scrollTo({ top: 129, behavior: 'instant' }));
  await expect(header).toHaveClass(/is-collapsed/);
  const position = await page.evaluate(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return scrollY;
  });
  expect(position).toBe(129);
  await page.evaluate(() => window.scrollTo({ top: 121, behavior: 'instant' }));
  await expect(header).toHaveClass(/is-collapsed/);
  await page.evaluate(() => window.scrollTo({ top: 110, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/is-collapsed/);
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await expect(header).toHaveClass(/is-collapsed/);
  await page.mouse.wheel(0, 400);
  await expect(header).toHaveClass(/is-collapsed/);
  await page.mouse.wheel(0, -80);
  await expect(header).not.toHaveClass(/is-collapsed/);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/is-collapsed/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('category navigation preserves menu access, keyboard focus, and content clicks', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await mockShop(page);
  await page.goto('/');
  await expect(page.locator('.home-repair')).toBeVisible();
  const header = page.locator('.site-header');
  await page.locator('.shop-all').focus();
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/is-collapsed/);
  await page.keyboard.press('Enter');
  await expect(page.locator('.category-menu')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('.category-menu')).not.toHaveAttribute('open');
  await page.locator('.desktop-search input').focus();
  await page.locator('.desktop-search input').press('Escape');
  // Focusing a native disclosure/search may scroll it into view; use an absolute destination.
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  await expect(header).toHaveClass(/is-collapsed/);
  await expect(page.locator('.header-navigation')).toHaveAttribute('inert', '');
  await expect
    .poll(() =>
      page
        .locator('.header-navigation')
        .evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBeLessThanOrEqual(2);
  expect(
    await page.evaluate(
      () => !!document.elementFromPoint(800, 110)?.closest('.site-header-slot'),
    ),
  ).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(header).not.toHaveClass(/is-collapsed/);
  await expect(page.locator('.header-main')).toBeVisible();
  await noOverflow(page);
});

test('category navigation is not pinned open after clicking a category', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await mockShop(page);
  await page.goto('/');
  await page.locator('.category-nav-links a').first().click();
  await expect(page).toHaveURL(/\/products\?category=/);
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.mouse.move(1000, 600);
  await page.mouse.wheel(0, 450);
  await expect(page.locator('.site-header')).toHaveClass(/is-collapsed/);
  await page.mouse.wheel(0, -80);
  await expect(page.locator('.site-header')).not.toHaveClass(/is-collapsed/);
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`storefront and authentication fit ${width}px in light and dark`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockShop(page);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      for (const path of ['/', '/products', '/login', '/register']) {
        await page.goto(path);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('.ui-loading')).toHaveCount(0);
        await expect(
          page.locator('[role="status"][aria-label^="Loading"]'),
        ).toHaveCount(0);
        await noOverflow(page);
        if ([390, 1440].includes(width))
          await page.screenshot({
            path: test
              .info()
              .outputPath(
                `${path.replaceAll('/', '') || 'home'}-${theme}-${width}.png`,
              ),
            fullPage: true,
          });
      }
    }
    expect(errors).toEqual([]);
  });
}

test('sign-in keeps the destination and cart quantity changes still use the services', async ({
  page,
}) => {
  await mockShop(page);
  await page.goto('/cart');
  await page.getByLabel('Username or email').fill('Lakshitha');
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.getByRole('button', { name: /Increase quantity/ }).click();
  await expect(page.getByLabel('Quantity: 2', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: /Proceed to checkout/ }).click();
  await expect(
    page.getByText('Secure checkout', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.header-navigation')).toHaveCount(0);
  await expect(
    page.getByText('Not yet validated', { exact: true }),
  ).toHaveCount(0);
  await noOverflow(page);
});

test('theme choice persists and keyboard skip link is hidden until focused', async ({
  page,
}) => {
  await mockShop(page);
  await page.goto('/');
  expect(
    await page
      .locator('.ui-skip')
      .evaluate((element) => element.getBoundingClientRect().bottom),
  ).toBeLessThan(0);
  await page.keyboard.press('Tab');
  await expect(page.locator('.ui-skip')).toBeFocused();
  expect(
    await page
      .locator('.ui-skip')
      .evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(0);
  await page
    .locator('footer')
    .getByRole('button', { name: 'Dark', exact: true })
    .click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .locator('footer')
    .getByRole('button', { name: 'System', exact: true })
    .click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});

test('product plate and assistant preserve purchase access, including mobile', async ({
  page,
}) => {
  await mockShop(page, 'CUSTOMER');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/products/${id}`);
    await expect(
      page.getByRole('heading', { name: product.name, exact: true }),
    ).toBeVisible();
    await expect(page.locator('.rating-plate').first()).toContainText(
      'Digital inverter',
    );
    await page.locator('.ai-launcher').click();
    await expect(page.locator('.ai-panel')).toBeVisible();
    if (width === 1440) {
      const panel = await page.locator('.ai-panel').boundingBox(),
        buy = await page.locator('.purchase-panel').boundingBox();
      expect(buy.x + buy.width).toBeLessThan(panel.x);
    }
    await noOverflow(page);
    await page.screenshot({
      path: test.info().outputPath(`assistant-${width}.png`),
      fullPage: true,
    });
    await page.getByRole('button', { name: /Close product assistant/ }).click();
    await expect(page.locator('.ai-launcher')).toBeFocused();
    await page.screenshot({
      path: test.info().outputPath(`product-${width}.png`),
      fullPage: true,
    });
  }
});

test('account, orders, repairs and admin views retain their routes', async ({
  page,
}) => {
  await mockShop(page, 'CUSTOMER');
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/cart',
      '/checkout',
      '/orders',
      `/orders/${order.id}`,
      '/repairs',
      '/repairs/repair-1',
      '/repairs/request',
      '/account',
    ]) {
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('.ui-loading')).toHaveCount(0);
      await noOverflow(page);
      await page.screenshot({
        path: test
          .info()
          .outputPath(`${path.replaceAll('/', '-')}-${width}.png`),
        fullPage: true,
      });
    }
    await page.getByRole('button', { name: 'Preferences' }).click();
    await expect(
      page.getByRole('heading', { name: 'Preferences' }),
    ).toBeVisible();
  }
  await page.unroute('http://localhost:3099/**');
  await mockShop(page, 'ADMIN');
  await page.goto('/admin');
  await expect(page.locator('.workspace-sidebar')).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: test.info().outputPath('admin.png'),
    fullPage: true,
  });
});

test('registration validates matching passwords and sends the existing request shape', async ({
  page,
}) => {
  await mockShop(page);
  await page.goto('/register');
  await page.getByLabel('Username', { exact: true }).fill('Lakshitha');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('lakshitha@example.com');
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page
    .getByLabel('Confirm password', { exact: true })
    .fill('different123');
  await page
    .getByRole('button', { name: 'Create account', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Your passwords do not match.',
  );
  await expect(page.getByLabel('Username', { exact: true })).toHaveValue(
    'Lakshitha',
  );
  await page
    .getByLabel('Confirm password', { exact: true })
    .fill('password123');
  const request = page.waitForRequest(
    (item) => item.method() === 'POST' && item.url().endsWith('/auth/register'),
  );
  await page
    .getByRole('button', { name: 'Create account', exact: true })
    .click();
  expect((await request).postDataJSON()).toEqual({
    username: 'Lakshitha',
    email: 'lakshitha@example.com',
    password: 'password123',
  });
  await expect(page).toHaveURL('/');
});

test('authenticated pages support the dark theme and offline feedback', async ({
  page,
}) => {
  await mockShop(page, 'CUSTOMER');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/cart',
      '/checkout',
      `/products/${id}`,
      '/orders',
      '/repairs',
      '/account',
    ]) {
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('.ui-loading')).toHaveCount(0);
      await noOverflow(page);
      if (path === '/cart' || path.startsWith('/products/'))
        await page.screenshot({
          path: test
            .info()
            .outputPath(`${path.replaceAll('/', '-')}-dark-${width}.png`),
          fullPage: true,
        });
    }
  }
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  // The banner reads navigator.onLine, so use the browser's real offline state.
  await page.context().setOffline(true);
  await expect(page.getByText(/You’re offline/)).toBeVisible();
  await page.context().setOffline(false);
  await expect(page.getByText(/You’re offline/)).toHaveCount(0);
});
