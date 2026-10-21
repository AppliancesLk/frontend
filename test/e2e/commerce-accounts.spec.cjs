const { test, expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');
let fixture;
test.beforeAll(async ({ playwright }) => {
  fixture = await createShopFixture(playwright);
});
test.afterAll(async () => cleanupShopFixture(fixture));
async function signIn(page, user) {
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(user.username);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
}
async function mailbox(api, email, subject) {
  const response = await api.get('/_test/mailbox', { params: { email } });
  const message = (await response.json()).messages.findLast((mail) =>
    mail.subject.includes(subject),
  );
  const token = message?.text.match(/#token=([a-f0-9]{64})/)?.[1];
  expect(token).toBeTruthy();
  return token;
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test('signup requires email verification and password reset revokes the existing session', async ({
  page,
}) => {
  const username = `e2e_${randomBytes(5).toString('hex')}`;
  const email = `${username}@example.com`,
    password = randomBytes(12).toString('hex');
  await page.goto('/register');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm password', { exact: true }).fill(password);
  await page
    .getByRole('button', { name: 'Create account', exact: true })
    .click();
  await expect(page).toHaveURL(/\/verify-email$/);
  const row = (
    await fixture.db.query('SELECT id, "isActive" FROM users WHERE email=$1', [
      email,
    ])
  ).rows[0];
  fixture.users.push(row.id);
  expect(row.isActive).toBe(false);
  await expect(
    page.getByRole('heading', { name: 'Verify your email', exact: true }),
  ).toBeVisible();
  await noOverflow(page);
  const verify = await mailbox(fixture.customer.api, email, 'Verify your');
  await page.goto(`/verify-email#token=${verify}`);
  await page
    .getByRole('button', { name: 'Verify email address', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Your email is verified',
  );
  await signIn(page, { username, password });
  await page.goto('/forgot-password');
  await page.getByLabel('Account email').fill(email);
  await page
    .getByRole('button', { name: 'Send reset instructions', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'password reset instructions',
  );
  const reset = await mailbox(fixture.customer.api, email, 'Reset your');
  await page.goto(`/reset-password#token=${reset}`);
  const nextPassword = randomBytes(12).toString('hex');
  await page.getByLabel('New password', { exact: true }).fill(nextPassword);
  await page
    .getByLabel('Confirm new password', { exact: true })
    .fill(nextPassword);
  await page
    .getByRole('button', { name: 'Save new password', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Your password has been changed',
  );
  await noOverflow(page);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.screenshot({
    path: test.info().outputPath('password-reset-success.png'),
    fullPage: true,
  });
  await page.goto('/account');
  await expect(page).toHaveURL(/\/login$/);
  await signIn(page, { username, password: nextPassword });
});

test('COD checkout, admin cash collection, live tracking and loyalty redemption work end to end', async ({
  page,
  browser,
}) => {
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}/stock`, {
    data: { stockQty: 20 },
  });
  await fixture.admin.api.patch(`/products/${fixture.washer.productID}`, {
    data: { price: 100000 },
  });
  await fixture.customer.api.delete('/cart');
  expect(
    (
      await fixture.customer.api.post('/cart/items', {
        data: { productId: fixture.washer.productID, quantity: 1 },
      })
    ).status(),
  ).toBe(201);
  await signIn(page, fixture.customer);
  await page.goto('/checkout');
  await page.getByLabel('First name', { exact: true }).fill('Test');
  await page.getByLabel('Last name', { exact: true }).fill('Buyer');
  await page.getByLabel('Phone number', { exact: true }).fill('0771234567');
  await page.getByLabel('Address line 1', { exact: true }).fill('24 Test Road');
  await page.getByLabel('City', { exact: true }).fill('Colombo');
  await page.getByLabel('Postal code', { exact: true }).fill('00100');
  await page
    .getByRole('button', { name: 'Prepare checkout', exact: true })
    .click();
  await expect(
    page.getByRole('radio', { name: /Cash on delivery/ }),
  ).toBeChecked();
  await noOverflow(page);
  await page
    .getByRole('button', { name: 'Place cash on delivery order', exact: true })
    .click();
  await expect(page).toHaveURL(/\/orders\/[a-f0-9-]+$/);
  const id = new URL(page.url()).pathname.split('/').pop();
  await expect(
    page
      .getByRole('list', { name: 'Order progress' })
      .getByText('Pending payment', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Order history', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Cash due on delivery:', { exact: false }),
  ).toBeVisible();
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const adminPage = await adminContext.newPage();
  await signIn(adminPage, fixture.admin);
  await adminPage.goto(`/admin/orders/${id}`);
  await adminPage
    .getByRole('button', { name: 'Save status: Processing', exact: true })
    .click();
  await expect(
    adminPage.getByText('Order status updated successfully.'),
  ).toBeVisible();
  await adminPage
    .getByRole('button', { name: 'Save status: Shipped', exact: true })
    .click();
  const deliver = adminPage.getByRole('button', {
    name: 'Save status: Delivered',
    exact: true,
  });
  await expect(deliver).toBeDisabled();
  await adminPage
    .getByLabel('I confirm the cash payment has been collected')
    .check();
  await deliver.click();
  await expect(
    adminPage.getByText('Loyalty credit earned:', { exact: false }),
  ).toContainText('100.00');
  await page.bringToFront();
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(
    page.getByText('Loyalty credit earned:', { exact: false }),
  ).toContainText('100.00');
  await expect(
    page
      .getByRole('heading', { name: 'Order history', exact: true })
      .locator('..')
      .getByText('Delivered', { exact: true }),
  ).toBeVisible();
  await page.goto('/account/loyalty');
  await expect(
    page.getByText('LKR 100.00', { exact: true }).first(),
  ).toBeVisible();
  await noOverflow(page);
  await fixture.admin.api.patch(`/products/${fixture.kettle.productID}`, {
    data: { price: 10 },
  });
  await fixture.customer.api.post('/cart/items', {
    data: { productId: fixture.kettle.productID, quantity: 1 },
  });
  // The customer API and UI share the same account but hold separate sessions.
  await page.goto('/checkout');
  await page.getByLabel('First name', { exact: true }).fill('Test');
  await page.getByLabel('Last name', { exact: true }).fill('Buyer');
  await page.getByLabel('Phone number', { exact: true }).fill('0771234567');
  await page.getByLabel('Address line 1', { exact: true }).fill('24 Test Road');
  await page.getByLabel('City', { exact: true }).fill('Colombo');
  await page.getByLabel('Postal code', { exact: true }).fill('00100');
  await page
    .getByRole('button', { name: 'Prepare checkout', exact: true })
    .click();
  await page.getByLabel('Use loyalty credit', { exact: true }).check();
  await page.getByLabel('Credit to use (LKR)', { exact: true }).fill('10.00');
  await page
    .getByRole('button', {
      name: 'Place order using loyalty credit',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/orders\/[a-f0-9-]+$/);
  await expect(
    page.getByText('Payment method:', { exact: false }),
  ).toContainText('Loyalty credit');
  await noOverflow(page);
  await page.screenshot({
    path: test.info().outputPath('loyalty-order.png'),
    fullPage: true,
  });
  await adminContext.close();
});

test('admin can find, deactivate and reactivate a user through the UI', async ({
  page,
}) => {
  await signIn(page, fixture.admin);
  await page.goto('/admin/users');
  await page
    .getByLabel('Search users by name or email')
    .fill(fixture.customer.username);
  const row = page
    .getByRole('row')
    .filter({ hasText: fixture.customer.username });
  await expect(row).toBeVisible();
  await row
    .getByRole('button', { name: 'Deactivate account', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('button', { name: 'Deactivate account', exact: true })
    .click();
  await expect(row.getByText('Deactivated', { exact: true })).toBeVisible();
  expect((await fixture.customer.api.get('/auth/profile')).status()).toBe(401);
  await row
    .getByRole('button', { name: 'Reactivate account', exact: true })
    .click();
  await expect(row.getByText('Active', { exact: true })).toBeVisible();
  await page.screenshot({
    path: test.info().outputPath('admin-users.png'),
    fullPage: true,
  });
  await noOverflow(page);
});
