const { test, expect } = require('@playwright/test');
const { randomBytes, randomUUID } = require('node:crypto');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
let fixture;
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { images: ['https://assets.example.com/promotion-washer.png'] },
  });
});
test.afterAll(async () => {
  if (!fixture) return;
  try {
    await fixture.db.query(
      `DELETE FROM notifications WHERE type='PROMOTION' AND split_part("eventKey", ':', 3) IN (SELECT r.id::text FROM promotion_runs r JOIN promotions p ON p.id=r."campaignId" WHERE p."createdBy"=$1)`,
      [fixture.admin.id],
    );
    await fixture.db.query('DELETE FROM promotions WHERE "createdBy"=$1', [
      fixture.admin.id,
    ]);
  } finally {
    await cleanupShopFixture(fixture);
  }
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
async function chooseUser(page, user) {
  await page.getByLabel('Search users', { exact: true }).fill(user.username);
  await page
    .getByRole('checkbox', {
      name: `Select user ${user.username}`,
      exact: true,
    })
    .check();
}
async function chooseProduct(page, product) {
  await page.getByLabel('Search products', { exact: true }).fill(product.name);
  await page
    .getByRole('checkbox', {
      name: `Select product ${product.name}`,
      exact: true,
    })
    .check();
}
test('admin creates, previews, sends, views history, edits and resends a promotion', async ({
  page,
}) => {
  await page.route('https://assets.example.com/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect x="15" y="5" width="90" height="110" rx="8" fill="#d5dadd"/><circle cx="60" cy="68" r="29" fill="#75838c"/></svg>',
    }),
  );
  await signIn(page, fixture.admin);
  await page.goto('/admin/promotions');
  await expect(
    page.getByRole('heading', { name: 'Promotions', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Send new promotion/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Create a promotion', exact: true }),
  ).toBeVisible();
  await chooseUser(page, fixture.customer);
  await chooseUser(page, fixture.admin);
  await chooseProduct(page, fixture.washer);
  await chooseProduct(page, fixture.kettle);
  const subject = `A thoughtful offer ${randomBytes(4).toString('hex')}`;
  await page.getByLabel('Email subject', { exact: true }).fill(subject);
  await page
    .getByLabel('Email headline', { exact: true })
    .fill('Make every day a little better.');
  await page
    .getByLabel('Inbox preview text')
    .fill('Two useful finds for your home.');
  await page
    .getByLabel('Email message', { exact: true })
    .fill(
      'A special collection, selected for you.\n\n<script>alert("unsafe")</script>\nFind your next everyday favourite.',
    );
  await page
    .getByLabel('Button label', { exact: true })
    .fill('Shop these offers');
  await page
    .getByLabel('Closing note (optional)')
    .fill('Offers available while stocks last.');
  const preview = page.frameLocator('iframe[title="Promotion email preview"]');
  await expect(
    preview.getByRole('heading', { name: 'Make every day a little better.' }),
  ).toBeVisible();
  await expect(
    preview.getByText(fixture.washer.name, { exact: true }),
  ).toBeVisible();
  await expect(
    preview.locator('img[alt="' + fixture.washer.name + '"]'),
  ).toHaveAttribute('src', /promotion-washer/);
  await expect(preview.locator('script')).toHaveCount(0);
  await expect(
    preview.getByText('<script>alert("unsafe")</script>', { exact: false }),
  ).toBeVisible();
  await noOverflow(page);
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/promotions\/[a-f0-9-]+$/);
  const id = new URL(page.url()).pathname.split('/').pop();
  await expect(page.getByRole('status')).toContainText('Draft saved.');
  await page
    .locator('iframe[title="Promotion email preview"]')
    .scrollIntoViewIfNeeded();
  await expect(
    preview.getByRole('heading', { name: 'Make every day a little better.' }),
  ).toBeVisible();
  expect(
    await preview
      .locator('body')
      .evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
  ).toBe(true);
  await page
    .locator('iframe[title="Promotion email preview"]')
    .screenshot({ path: test.info().outputPath('promotion-preview.png') });
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({
    path: test.info().outputPath('promotion-editor.png'),
    fullPage: true,
  });
  await page
    .getByRole('button', { name: 'Review & send', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('2 recipients');
  await expect(dialog).toContainText(subject);
  await dialog
    .getByRole('button', { name: 'Send promotion', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText('Promotion queued');
  await expect(page.getByText('Sent', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  const inbox = await (
    await fixture.admin.api.get('/_test/mailbox', {
      params: { email: `${fixture.customer.username}@example.com` },
    })
  ).json();
  expect(
    inbox.messages.filter((message) => message.subject === subject),
  ).toHaveLength(1);
  expect(
    inbox.messages.find((message) => message.subject === subject).text,
  ).toContain(fixture.customer.username);
  await page
    .getByRole('link', { name: 'Back to promotions', exact: false })
    .click();
  const row = page.getByRole('row').filter({ hasText: subject });
  await expect(row).toContainText('Sent');
  await noOverflow(page);
  await page.screenshot({
    path: test.info().outputPath('promotion-history.png'),
    fullPage: true,
  });
  await row
    .getByRole('link', { name: 'View, edit & resend', exact: true })
    .click();
  await expect(page.getByLabel('Email subject', { exact: true })).toHaveValue(
    subject,
  );
  await page
    .getByLabel('Email subject', { exact: true })
    .fill(`${subject} — round two`);
  await page
    .getByLabel('Email message', { exact: true })
    .fill('An updated offer for you.');
  await page
    .getByRole('button', { name: 'Review & send', exact: true })
    .click();
  await dialog
    .getByRole('button', { name: 'Send promotion', exact: true })
    .click();
  await expect(page.getByText('Sent', { exact: true })).toHaveCount(2, {
    timeout: 20000,
  });
  await page
    .getByRole('button', { name: 'View sent version', exact: true })
    .last()
    .click();
  await expect(
    page.getByRole('heading', {
      name: `Sent version: ${subject}`,
      exact: true,
    }),
  ).toBeVisible();
  const historic = page
    .frameLocator('iframe[title="Promotion email preview"]')
    .last();
  await expect(
    historic.getByText('<script>alert("unsafe")</script>', { exact: false }),
  ).toBeVisible();
  await noOverflow(page);
  const detail = await (
    await fixture.admin.api.get(`/admin/promotions/${id}`, { maxRetries: 2 })
  ).json();
  expect(detail.runs).toHaveLength(2);
  expect(detail.userIds).toHaveLength(2);
});
test('all-users selection, incomplete drafts and preview failure are handled without sending', async ({
  page,
}) => {
  await signIn(page, fixture.admin);
  await page.goto('/admin/promotions/new');
  await page
    .getByRole('radio', { name: 'All eligible users', exact: true })
    .check();
  await expect(page.getByLabel('Search users', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/\d+ eligible recipients/)).not.toHaveText(
    '0 eligible recipients',
  );
  await expect(
    page.getByRole('button', { name: 'Review & send', exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel('Email subject', { exact: true })
    .fill('A draft for later');
  await page.getByRole('button', { name: 'Save draft', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/promotions\/[a-f0-9-]+$/);
  await page.reload();
  await expect(page.getByLabel('Email subject', { exact: true })).toHaveValue(
    'A draft for later',
  );
  await page.route('**/admin/promotions/preview', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Preview temporarily unavailable' }),
    }),
  );
  await page
    .getByLabel('Email headline', { exact: true })
    .fill('Still editable');
  await expect(page.getByRole('alert')).toContainText(
    'Unable to generate the preview. Please try again.',
  );
  await expect(page.getByLabel('Email headline', { exact: true })).toHaveValue(
    'Still editable',
  );
  await noOverflow(page);
  await page.goto(`/admin/promotions/${randomUUID()}`);
  await expect(page.getByRole('alert')).toContainText('Promotion not found');
  await expect(
    page.getByRole('button', { name: 'Save draft', exact: true }),
  ).toHaveCount(0);
});
test('customer accounts cannot open admin promotions', async ({ page }) => {
  await signIn(page, fixture.customer);
  await page.goto('/admin/promotions');
  await expect(page).toHaveURL(/\/forbidden$/);
});
