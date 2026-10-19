const { test, expect } = require('@playwright/test');
const { createShopFixture, cleanupShopFixture } = require('../helpers/shop-fixture.cjs');
let fixture;
test.beforeAll(async ({ playwright }) => { fixture = await createShopFixture(playwright); });
test.afterAll(async () => {
  try {
    if (fixture?.customer) await fixture.db.query('DELETE FROM repair_tickets WHERE "customerId"=$1', [fixture.customer.id]);
  } finally { await cleanupShopFixture(fixture); }
});

test('admin opens the repair list and details, then approves and rejects without body IDs', async ({ page }) => {
  const repairs = [];
  for (let index = 0; index < 2; index++) {
    const response = await fixture.customer.api.post('/repairs', { data: {
      device: { deviceType: 'Washer', brand: 'LG', model: `Admin repair ${index}` },
      problemDescription: 'The washer stops during its normal spin cycle.',
    } });
    expect(response.status()).toBe(201);
    repairs.push(await response.json());
  }
  await page.goto('/login');
  await page.getByLabel('Username or email').fill(fixture.admin.username);
  await page.getByLabel('Password', { exact: true }).fill(fixture.admin.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto('/admin/repairs');
  const row = page.getByRole('row').filter({ hasText: repairs[0].reference });
  await expect(row).toBeVisible();
  await row.getByRole('link', { name: 'View details', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Repair request details' })).toBeVisible();
  await page.getByRole('button', { name: 'Approve repair', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText('Approved', { exact: true })).toBeVisible();
  expect((await (await fixture.customer.api.get(`/repairs/${repairs[0].id}`)).json()).status).toBe('APPROVED');
  await page.goto(`/admin/repairs/${repairs[1].id}`);
  await page.getByRole('button', { name: 'Reject repair', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(page.getByText('Rejected', { exact: true })).toBeVisible();
  expect((await (await fixture.customer.api.get(`/repairs/${repairs[1].id}`)).json()).status).toBe('REJECTED');
});
