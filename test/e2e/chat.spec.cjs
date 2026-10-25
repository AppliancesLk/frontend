const { test, expect } = require('@playwright/test');
const {
  createShopFixture,
  cleanupShopFixture,
} = require('../helpers/shop-fixture.cjs');

test('customer and admin exchange live messages, restore history, and close a chat', async ({
  browser,
  playwright,
}) => {
  const fixture = await createShopFixture(playwright);
  const { viewport, isMobile, hasTouch } = test.info().project.use;
  const customerContext = await browser.newContext({
    viewport,
    isMobile,
    hasTouch,
    storageState: await fixture.customer.api.storageState(),
  });
  const adminContext = await browser.newContext({
    viewport,
    isMobile,
    hasTouch,
    storageState: await fixture.admin.api.storageState(),
  });
  try {
    const customer = await customerContext.newPage();
    const admin = await adminContext.newPage();
    await customer.goto('/support/chat');
    await admin.goto('/admin/chats');
    await expect(
      customer.getByText('Connected', { exact: true }),
    ).toBeVisible();
    await customer
      .getByRole('button', { name: 'New chat', exact: true })
      .click();
    await expect(customer.getByLabel('Message', { exact: true })).toBeVisible();
    const row = admin
      .getByRole('navigation', { name: 'Chat sessions' })
      .getByRole('button')
      .filter({ hasText: fixture.customer.username });
    await expect(row).toHaveCount(1);
    await row.click();
    await customer
      .getByLabel('Message', { exact: true })
      .fill('Can you help with my appliance?');
    await customer.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
      admin
        .getByRole('log')
        .getByText('Can you help with my appliance?', { exact: true }),
    ).toBeVisible();
    await admin
      .getByLabel('Message', { exact: true })
      .fill('Yes, our support team can help.');
    await admin.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
      customer
        .getByRole('log')
        .getByText('Yes, our support team can help.', { exact: true }),
    ).toBeVisible();
    await customer.screenshot({
      path: test.info().outputPath('customer-conversation.png'),
    });
    await admin.screenshot({
      path: test.info().outputPath('admin-conversation.png'),
    });
    if (viewport.width < 1024) {
      for (const page of [customer, admin]) {
        const send = await page
          .getByRole('button', { name: 'Send', exact: true })
          .boundingBox();
        expect(send.y + send.height).toBeLessThanOrEqual(viewport.height);
      }
      await customer
        .getByLabel('Message', { exact: true })
        .fill('Draft survives a change in layout.');
      await customer.setViewportSize({ width: 1024, height: viewport.height });
      await expect(customer.getByLabel('Message', { exact: true })).toHaveValue(
        'Draft survives a change in layout.',
      );
      await customer.setViewportSize(viewport);
      await expect(customer.getByLabel('Message', { exact: true })).toHaveValue(
        'Draft survives a change in layout.',
      );
      await customer.getByLabel('Message', { exact: true }).fill('');
      for (const page of [customer, admin]) {
        await page.setViewportSize({ width: viewport.width, height: 500 });
        const send = await page
          .getByRole('button', { name: 'Send', exact: true })
          .boundingBox();
        expect(send.y + send.height).toBeLessThanOrEqual(500);
        await page.setViewportSize(viewport);
      }
      await expect
        .poll(
          async () =>
            (await (await fixture.customer.api.get('/chats')).json()).items[0]
              .customerUnreadCount,
        )
        .toBe(0);
      await customer
        .getByRole('button', { name: 'Back to chats', exact: true })
        .click();
      await admin
        .getByLabel('Message', { exact: true })
        .fill('A new reply while you are viewing sessions.');
      await admin.getByRole('button', { name: 'Send', exact: true }).click();
      const unread = customer
        .getByRole('navigation', { name: 'Chat sessions' })
        .getByRole('button')
        .filter({ hasText: 'A new reply while you are viewing sessions.' });
      await expect(unread).toContainText('1 unread');
      await unread.click();
      await expect(
        customer
          .getByRole('log')
          .getByText('A new reply while you are viewing sessions.', {
            exact: true,
          }),
      ).toBeVisible();
    }
    await customerContext.setOffline(true);
    await expect(
      (viewport.width < 1024
        ? customer.getByRole('dialog', {
            name: 'Support conversation',
            exact: true,
          })
        : customer
      ).getByText('Disconnected', { exact: true }),
    ).toBeVisible();
    await admin
      .getByLabel('Message', { exact: true })
      .fill('This reply arrived while you were offline.');
    await admin.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
      admin
        .getByRole('log')
        .getByText('This reply arrived while you were offline.', {
          exact: true,
        }),
    ).toBeVisible();
    await customerContext.setOffline(false);
    await expect(
      (viewport.width < 1024
        ? customer.getByRole('dialog', {
            name: 'Support conversation',
            exact: true,
          })
        : customer
      ).getByText('Connected', { exact: true }),
    ).toBeVisible({
      timeout: 15000,
    });
    await expect(
      customer
        .getByRole('log')
        .getByText('This reply arrived while you were offline.', {
          exact: true,
        }),
    ).toBeVisible();
    await customer.reload();
    await customer
      .getByRole('navigation', { name: 'Chat sessions' })
      .getByRole('button')
      .first()
      .click();
    await expect(
      customer
        .getByRole('log')
        .getByText('Yes, our support team can help.', { exact: true }),
    ).toBeVisible();
    if (viewport.width < 1024)
      await customer
        .getByRole('button', { name: 'Back to chats', exact: true })
        .click();
    await customer
      .getByRole('button', { name: 'New chat', exact: true })
      .click();
    await expect(
      customer
        .getByRole('log')
        .getByText('Can you help with my appliance?', { exact: true }),
    ).toHaveCount(0);
    if (viewport.width < 1024)
      await customer
        .getByRole('button', { name: 'Back to chats', exact: true })
        .click();
    await customer
      .getByRole('navigation', { name: 'Chat sessions' })
      .getByRole('button')
      .filter({ hasText: 'This reply arrived while you were offline.' })
      .click();
    await expect(
      customer
        .getByRole('log')
        .getByText('Can you help with my appliance?', { exact: true }),
    ).toBeVisible();
    await admin
      .getByRole('button', { name: 'Close chat', exact: true })
      .click();
    if (viewport.width < 1024) {
      await admin.keyboard.press('Escape');
      await expect(
        admin.getByRole('dialog', {
          name: 'Support conversation',
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        admin.getByRole('dialog', { name: 'Close this chat?', exact: true }),
      ).toHaveCount(0);
      await admin
        .getByRole('button', { name: 'Close chat', exact: true })
        .click();
    }
    await admin
      .getByRole('dialog', { name: 'Close this chat?', exact: true })
      .getByRole('button', { name: 'Close chat', exact: true })
      .click();
    await expect(
      customer.getByText(
        'This chat is closed. Its history is still available.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(customer.getByLabel('Message', { exact: true })).toHaveCount(
      0,
    );
    expect(
      await customer.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
  } finally {
    await customerContext.close();
    await adminContext.close();
    await cleanupShopFixture(fixture);
  }
});
