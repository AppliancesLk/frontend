const { test, expect } = require('@playwright/test');
const { createShopFixture, cleanupShopFixture } = require('../helpers/shop-fixture.cjs');

test('customer and admin exchange live messages, restore history, and close a chat', async ({ browser, playwright }) => {
  const fixture = await createShopFixture(playwright);
  const { viewport, isMobile, hasTouch } = test.info().project.use;
  const customerContext = await browser.newContext({ viewport, isMobile, hasTouch, storageState: await fixture.customer.api.storageState() });
  const adminContext = await browser.newContext({ viewport, isMobile, hasTouch, storageState: await fixture.admin.api.storageState() });
  try {
    const customer = await customerContext.newPage();
    const admin = await adminContext.newPage();
    await customer.goto('/support/chat');
    await admin.goto('/admin/chats');
    await expect(customer.getByText('Connected', { exact: true })).toBeVisible();
    await customer.getByRole('button', { name: 'New chat', exact: true }).click();
    await expect(customer.getByLabel('Message', { exact: true })).toBeVisible();
    const row = admin.getByRole('navigation', { name: 'Chat sessions' }).getByRole('button').filter({ hasText: fixture.customer.username });
    await expect(row).toHaveCount(1);
    await row.click();
    await customer.getByLabel('Message', { exact: true }).fill('Can you help with my appliance?');
    await customer.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(admin.getByRole('log').getByText('Can you help with my appliance?', { exact: true })).toBeVisible();
    await admin.getByLabel('Message', { exact: true }).fill('Yes, our support team can help.');
    await admin.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(customer.getByRole('log').getByText('Yes, our support team can help.', { exact: true })).toBeVisible();
    await customerContext.setOffline(true);
    await expect(customer.getByText('Disconnected', { exact: true })).toBeVisible();
    await admin.getByLabel('Message', { exact: true }).fill('This reply arrived while you were offline.');
    await admin.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(admin.getByRole('log').getByText('This reply arrived while you were offline.', { exact: true })).toBeVisible();
    await customerContext.setOffline(false);
    await expect(customer.getByText('Connected', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(customer.getByRole('log').getByText('This reply arrived while you were offline.', { exact: true })).toBeVisible();
    await customer.reload();
    await customer.getByRole('navigation', { name: 'Chat sessions' }).getByRole('button').first().click();
    await expect(customer.getByRole('log').getByText('Yes, our support team can help.', { exact: true })).toBeVisible();
    await customer.getByRole('button', { name: 'New chat', exact: true }).click();
    await expect(customer.getByRole('log').getByText('Can you help with my appliance?', { exact: true })).toHaveCount(0);
    await customer.getByRole('navigation', { name: 'Chat sessions' }).getByRole('button').filter({ hasText: 'This reply arrived while you were offline.' }).click();
    await expect(customer.getByRole('log').getByText('Can you help with my appliance?', { exact: true })).toBeVisible();
    await admin.getByRole('button', { name: 'Close chat', exact: true }).click();
    await expect(customer.getByText('This chat is closed. Its history is still available.', { exact: true })).toBeVisible();
    await expect(customer.getByLabel('Message', { exact: true })).toHaveCount(0);
    expect(await customer.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  } finally {
    await customerContext.close();
    await adminContext.close();
    await cleanupShopFixture(fixture);
  }
});
