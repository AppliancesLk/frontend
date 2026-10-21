const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
let fixture, backup;
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
  backup = (await fixture.db.query('SELECT * FROM storefront_theme WHERE id=1'))
    .rows[0];
});
test.afterAll(async () => {
  try {
    if (backup)
      await fixture.db.query(
        'UPDATE storefront_theme SET theme=$1, headline=$2, message=$3, "showGreeting"=$4, decorations=$5, "startsAt"=$6, "endsAt"=$7, version=$8, "updatedBy"=$9, "updatedAt"=$10, animations=$11 WHERE id=1 AND "updatedBy"=$12',
        [
          backup.theme,
          backup.headline,
          backup.message,
          backup.showGreeting,
          backup.decorations,
          backup.startsAt,
          backup.endsAt,
          backup.version,
          backup.updatedBy,
          backup.updatedAt,
          backup.animations,
          fixture.admin.id,
        ],
      );
  } finally {
    await cleanupShopFixture(fixture);
  }
});
async function configure(overrides = {}) {
  const settings = await (
    await fixture.admin.api.get('/storefront-theme/admin')
  ).json();
  const response = await fixture.admin.api.put('/storefront-theme/admin', {
    data: {
      theme: 'DEFAULT',
      headline: '',
      message: '',
      showGreeting: true,
      decorations: true,
      animations: true,
      startsAt: null,
      endsAt: null,
      version: settings.version,
      ...overrides,
    },
  });
  expect(response.status()).toBe(200);
  return response.json();
}
test.beforeEach(async () => {
  await configure();
});
async function signIn(page, user) {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(user.username);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}
async function siteColors(page) {
  return page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      [
        '--primary',
        '--primary-hover',
        '--on-primary',
        '--bg-page',
        '--bg-surface',
        '--bg-inverse',
        '--text-primary',
        '--text-secondary',
        '--text-link',
        '--border-default',
        '--focus-ring',
        '--bg-footer',
      ].map((key) => [key, styles.getPropertyValue(key)]),
    );
  });
}
test('admin previews all occasions, saves custom text and restores Default', async ({
  page,
}) => {
  await signIn(page, fixture.admin);
  await page.goto('/admin/themes');
  await expect(
    page.getByRole('heading', { name: 'Seasonal themes', exact: true }),
  ).toBeVisible();
  const preview = page.getByTestId('season-preview');
  for (const [name, theme] of [
    ['Avurudu', 'AVURUDU'],
    ['Christmas', 'CHRISTMAS'],
    ['Halloween', 'HALLOWEEN'],
    ['Easter', 'EASTER'],
  ]) {
    await page.getByRole('radio', { name, exact: true }).check();
    await expect(preview).toHaveAttribute('data-season', theme);
    await expect(preview.locator(`[data-ornament="${theme}"]`)).toHaveCount(1);
    await expect(page.locator('html')).not.toHaveAttribute('data-season');
    await page
      .getByRole('button', { name: 'Dark preview', exact: true })
      .click();
    await expect(preview).toHaveAttribute('data-theme', 'dark');
    await page
      .getByRole('button', { name: 'Light preview', exact: true })
      .click();
  }
  await page.getByRole('radio', { name: 'Christmas', exact: true }).check();
  await page.getByLabel('Greeting headline').fill('Christmas, made special.');
  await page
    .getByLabel('Greeting message')
    .fill('A little joy for every home.');
  await page.getByRole('button', { name: 'Save theme', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Seasonal theme saved');
  await expect(page.locator('html')).toHaveAttribute(
    'data-season',
    'CHRISTMAS',
  );
  await noOverflow(page);
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: test.info().outputPath('admin-christmas.png'),
    fullPage: true,
  });
  await page.reload();
  await expect(page.getByLabel('Greeting headline')).toHaveValue(
    'Christmas, made special.',
  );
  await page
    .getByRole('button', { name: 'Restore default', exact: true })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Restore default', exact: true })
    .click();
  await expect(page.locator('html')).not.toHaveAttribute('data-season');
  await expect(preview.locator('[data-ornament]')).toHaveCount(0);
  const settings = await (
    await fixture.admin.api.get('/storefront-theme/admin')
  ).json();
  expect(settings.theme).toBe('DEFAULT');
  expect(settings.headline).toBe('');
});

test('admin schedule validation and concurrent edit errors preserve saved configuration', async ({
  page,
}) => {
  await signIn(page, fixture.admin);
  await page.goto('/admin/themes');
  await page.getByRole('radio', { name: 'Christmas', exact: true }).check();
  await page
    .getByRole('radio', { name: 'Schedule a start', exact: true })
    .check();
  await page.getByLabel('Starts at', { exact: true }).fill('2099-12-25T00:00');
  await page
    .getByLabel('Ends at (optional)', { exact: true })
    .fill('2099-12-24T00:00');
  await page.getByRole('button', { name: 'Save theme', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'end must be in the future and after the start',
  );
  expect(
    (await (await fixture.admin.api.get('/storefront-theme/admin')).json())
      .theme,
  ).toBe('DEFAULT');
  await page
    .getByLabel('Ends at (optional)', { exact: true })
    .fill('2099-12-27T00:00');
  await page.getByRole('button', { name: 'Save theme', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Theme scheduled');
  await expect(page.locator('html')).not.toHaveAttribute('data-season');
  const scheduled = await (
    await fixture.admin.api.get('/storefront-theme/admin')
  ).json();
  expect(scheduled.startsAt).toBe('2099-12-24T18:30:00.000Z');
  expect(scheduled.endsAt).toBe('2099-12-26T18:30:00.000Z');
  await configure({ theme: 'EASTER' });
  await page
    .getByRole('radio', { name: 'Start immediately', exact: true })
    .check();
  await page.getByLabel('Ends at (optional)', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Save theme', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'changed in another session',
  );
  await page
    .getByRole('button', { name: 'Reload settings', exact: true })
    .click();
  await expect(
    page.getByRole('radio', { name: 'Easter', exact: true }),
  ).toBeChecked();
});
test('seasonal banners preserve all site colors across public and customer pages', async ({
  page,
}) => {
  await page.goto('/login');
  const baseline = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--primary'),
  );
  const baselineColors = await siteColors(page);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  const darkColors = await siteColors(page);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light';
  });
  for (const theme of ['AVURUDU', 'CHRISTMAS', 'HALLOWEEN', 'EASTER']) {
    await configure({ theme });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-season', theme);
    expect(await siteColors(page)).toEqual(baselineColors);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
    });
    expect(await siteColors(page)).toEqual(darkColors);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    await expect(
      page.getByRole('complementary', {
        name: 'Seasonal greeting',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.locator(`[data-ornament="${theme}"]`).first(),
    ).toBeVisible();
    await noOverflow(page);
    await page.screenshot({
      path: test.info().outputPath(`${theme.toLowerCase()}-home.png`),
      fullPage: false,
    });
  }
  await configure({ theme: 'CHRISTMAS' });
  for (const route of [
    '/products',
    '/login',
    '/register',
    '/forgot-password',
    '/verify-email',
    '/reset-password',
    '/missing-page',
  ]) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute(
      'data-season',
      'CHRISTMAS',
    );
    await expect(
      page.locator('[data-ornament="CHRISTMAS"]').first(),
    ).toBeVisible();
    await noOverflow(page);
  }
  await signIn(page, fixture.customer);
  for (const route of [
    '/cart',
    '/checkout',
    '/orders',
    '/account',
    '/account/loyalty',
    '/repairs',
  ]) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute(
      'data-season',
      'CHRISTMAS',
    );
    await expect(
      page.locator('[data-ornament="CHRISTMAS"]').first(),
    ).toBeVisible();
    await noOverflow(page);
  }
  await configure();
  await page.goto('/login');
  await expect(page.locator('html')).not.toHaveAttribute('data-season');
  await expect(page.locator('[data-ornament]')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary'),
    ),
  ).toBe(baseline);
});

test('banner effects pause on demand and offscreen, and respect reduced motion, data saving and admin switches', async ({
  page,
}) => {
  await configure({ theme: 'CHRISTMAS', animations: true });
  await page.goto('/');
  const banner = page.getByRole('complementary', {
    name: 'Seasonal greeting',
    exact: true,
  });
  await expect(banner).toHaveAttribute('data-motion', 'running');
  await expect(banner.locator('.season-particle')).toHaveCount(16);
  const sleigh = banner.locator('.season-sleigh');
  const time = await sleigh.evaluate((el) =>
    Number(el.getAnimations()[0]?.currentTime ?? 0),
  );
  await expect
    .poll(() =>
      sleigh.evaluate((el) => Number(el.getAnimations()[0]?.currentTime ?? 0)),
    )
    .toBeGreaterThan(time + 100);
  await banner
    .getByRole('button', { name: 'Pause effects', exact: true })
    .click();
  await expect(banner).toHaveAttribute('data-motion', 'paused');
  expect(
    await banner.evaluate((el) =>
      el
        .getAnimations({ subtree: true })
        .every((animation) => animation.playState === 'paused'),
    ),
  ).toBe(true);
  await page.reload();
  await expect(
    banner.getByRole('button', { name: 'Play effects', exact: true }),
  ).toBeVisible();
  await banner
    .getByRole('button', { name: 'Play effects', exact: true })
    .click();
  await expect(banner).toHaveAttribute('data-motion', 'running');
  if (page.viewportSize().width >= 1024) {
    await page.evaluate(() => window.scrollTo(0, 650));
    const header = page.locator('.site-header');
    await expect(header).toHaveClass(/is-collapsed/);
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, -80);
      await expect(header).not.toHaveClass(/is-collapsed/);
      await page.mouse.wheel(0, 100);
      await expect(header).toHaveClass(/is-collapsed/);
    }
  }
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(banner).toHaveAttribute('data-motion', 'paused');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(banner).toHaveAttribute('data-motion', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(banner).toHaveAttribute('data-motion', 'disabled');
  expect(
    await banner.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(banner.getByRole('button')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await configure({ theme: 'CHRISTMAS', animations: false });
  await page.reload();
  await expect(banner).toHaveAttribute('data-motion', 'disabled');
  expect(
    await banner.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(banner.locator('[data-scene="CHRISTMAS"]')).toBeVisible();
  await configure({ theme: 'CHRISTMAS', animations: true });
  await page.addInitScript(() => {
    const connection = new EventTarget();
    Object.defineProperty(connection, 'saveData', { value: true });
    Object.defineProperty(navigator, 'connection', {
      value: connection,
      configurable: true,
    });
  });
  await page.reload();
  await expect(banner).toHaveAttribute('data-motion', 'disabled');
  expect(
    await banner.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
});
test('greeting and decoration switches work, text stays literal, and dark preference remains', async ({
  page,
}) => {
  await configure({
    theme: 'HALLOWEEN',
    headline: '<img src=x onerror=alert(1)>',
    showGreeting: true,
    decorations: false,
  });
  await page.goto('/login');
  await expect(
    page.getByText('<img src=x onerror=alert(1)>', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-ornament]')).toHaveCount(0);
  await expect(page.locator('.season-greeting img')).toHaveCount(0);
  await page.evaluate(() => {
    localStorage.setItem('al-theme', 'dark');
    document.documentElement.dataset.theme = 'dark';
  });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute(
    'data-season',
    'HALLOWEEN',
  );
  await page.screenshot({
    path: test.info().outputPath('halloween-dark.png'),
    fullPage: true,
  });
  await configure({ theme: 'EASTER', showGreeting: false, decorations: false });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-season', 'EASTER');
  await expect(page.locator('.season-greeting')).toHaveCount(0);
  await expect(page.locator('[data-ornament]')).toHaveCount(0);
});
test('scheduled themes start and expire automatically even when the API stalls at expiry', async ({
  page,
}) => {
  const now = Date.now();
  await configure({
    theme: 'CHRISTMAS',
    startsAt: new Date(now + 5000).toISOString(),
    endsAt: new Date(now + 12000).toISOString(),
  });
  await page.goto('/login');
  await expect(page.locator('html')).not.toHaveAttribute('data-season');
  await expect(page.locator('html')).toHaveAttribute(
    'data-season',
    'CHRISTMAS',
    { timeout: 10000 },
  );
  await page.route('**/storefront-theme', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 15000));
    await route.abort().catch(() => {});
  });
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('html')).not.toHaveAttribute('data-season', {
    timeout: 10000,
  });
  await expect(page.locator('[data-ornament]')).toHaveCount(0);
});
test('an unavailable seasonal API leaves a functional Default storefront', async ({
  page,
}) => {
  await page.route('**/storefront-theme', (route) => route.abort());
  await page.goto('/products');
  await expect(page.locator('html')).not.toHaveAttribute('data-season');
  await expect(page.locator('[data-ornament]')).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: /products/i }).first(),
  ).toBeVisible();
  await noOverflow(page);
});
