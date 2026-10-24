/**
 * TC-E2E-003: Repair Service Flow
 *
 * Tests the core repair service journey: customer creates request, admin approves.
 *
 * Preconditions:
 * - Test customer account created
 * - Test admin account created
 * - Backend running with test database
 *
 * Flow:
 * 1. Login as customer
 * 2. Create repair request
 * 3. Verify request created
 * 4. Logout
 * 5. Login as admin
 * 6. Find and approve repair request
 * 7. Verify approved status in admin view
 *
 * Note: Customer re-login for final verification is skipped to avoid rate limiting
 */
const { test, expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const {
  createJourneyFixture,
  cleanupJourneyFixture,
} = require('../fixtures/journey-fixture.cjs');
const {
  loginAsCustomer,
  loginAsAdmin,
  logout,
} = require('../helpers/auth.helpers.cjs');

let fixture;
let pageErrors = [];
let createdRepairId = null;
let repairReference = null;

test.describe('TC-E2E-003: Repair Service Flow', () => {
  test.beforeAll(async ({ playwright }) => {
    fixture = await createJourneyFixture(playwright);
  });

  test.afterAll(async () => {
    // Clean up repair created during tests
    if (createdRepairId && fixture?.db) {
      await fixture.db.query('DELETE FROM repair_tickets WHERE id=$1', [
        createdRepairId,
      ]);
    }
    await cleanupJourneyFixture(fixture);
  });

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
  });

  test.afterEach(() => {
    expect(pageErrors).toEqual([]);
  });

  test('Complete repair service flow: customer creates, admin approves', async ({
    page,
  }, testInfo) => {
    const deviceSuffix = randomBytes(4).toString('hex');

    // ==========================================
    // CUSTOMER: Create repair request
    // ==========================================

    // Step 1: Login as customer
    await loginAsCustomer(page, fixture.customer);

    // Navigate to repairs
    await page.goto('/repairs');
    await expect(
      page.getByRole('heading', { name: /your repairs/i }),
    ).toBeVisible();

    // Take screenshot of repairs list
    await page.screenshot({
      path: testInfo.outputPath('01-customer-repairs.png'),
      fullPage: true,
    });

    // Step 2: Create repair request
    await page.goto('/repairs/request');
    await expect(
      page.getByRole('heading', { name: 'Request a repair' }),
    ).toBeVisible();

    // Fill device information
    await page
      .getByLabel('Device type', { exact: true })
      .fill('Washing Machine');
    await page.getByLabel('Brand', { exact: true }).fill('Samsung');
    await page.getByLabel('Model', { exact: true }).fill(`WM-E2E-${deviceSuffix}`);
    await page
      .getByLabel('Serial number')
      .fill(`SN-${deviceSuffix.toUpperCase()}`);

    // Fill problem description
    await page
      .getByLabel('Describe the problem', { exact: true })
      .fill(
        'The washing machine is making a loud noise during the spin cycle. It started about a week ago and has been getting worse.',
      );

    // Take screenshot of filled form
    await page.screenshot({
      path: testInfo.outputPath('02-repair-form-filled.png'),
      fullPage: true,
    });

    // Submit repair request
    const submitResponse = page.waitForResponse(
      (res) =>
        res.url().includes('/repairs') && res.request().method() === 'POST',
    );

    await page
      .getByRole('button', { name: 'Submit repair request', exact: true })
      .click();

    const response = await submitResponse;
    expect(response.status()).toBe(201);
    const repairData = await response.json();
    createdRepairId = repairData.id;
    repairReference = repairData.reference;

    // Step 3: Verify request created - success screen
    await expect(
      page.getByRole('heading', { name: 'Repair request submitted' }),
    ).toBeVisible();
    await expect(page.getByText(repairReference).first()).toBeVisible();

    // Take screenshot of success
    await page.screenshot({
      path: testInfo.outputPath('03-repair-created-success.png'),
      fullPage: true,
    });

    // Verify repair appears in customer's list
    await page.goto('/repairs');
    await expect(page.getByText(repairReference)).toBeVisible();
    await expect(page.getByText('Pending review')).toBeVisible();

    // Take screenshot of repairs list
    await page.screenshot({
      path: testInfo.outputPath('04-customer-repairs-list.png'),
      fullPage: true,
    });

    // Step 4: Logout
    await logout(page);

    // ==========================================
    // ADMIN: Approve repair
    // ==========================================

    // Step 5: Login as admin
    await loginAsAdmin(page, fixture.admin);

    // Navigate to admin repairs
    await page.goto('/admin/repairs');
    await expect(
      page.getByRole('heading', { name: 'Repair requests' }),
    ).toBeVisible();

    // Step 6: Find repair by reference
    const repairRow = page.getByRole('row').filter({
      hasText: repairReference,
    });
    await expect(repairRow).toBeVisible();
    await expect(repairRow.getByText('Pending')).toBeVisible();

    // Take screenshot of admin repairs list
    await page.screenshot({
      path: testInfo.outputPath('05-admin-repairs-list.png'),
      fullPage: true,
    });

    // Click to view details
    await repairRow.getByRole('link', { name: 'View details' }).click();
    await expect(
      page.getByRole('heading', { name: 'Repair request details' }),
    ).toBeVisible();

    // Verify device information (use exact match)
    await expect(page.getByText('Washing Machine', { exact: true })).toBeVisible();
    await expect(page.getByText('Samsung', { exact: true })).toBeVisible();
    await expect(page.getByText(`WM-E2E-${deviceSuffix}`)).toBeVisible();

    // Take screenshot of repair details
    await page.screenshot({
      path: testInfo.outputPath('06-admin-repair-details.png'),
      fullPage: true,
    });

    // Approve the repair
    await page
      .getByRole('button', { name: 'Approve repair', exact: true })
      .click();

    // Confirm in dialog
    await expect(
      page.getByRole('heading', { name: /approve this repair/i }),
    ).toBeVisible();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Confirm', exact: true })
      .click();

    // Wait for dialog to close and status to update to Approved
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByText('Approved', { exact: true })).toBeVisible();

    // Take screenshot after approval
    await page.screenshot({
      path: testInfo.outputPath('07-repair-approved.png'),
      fullPage: true,
    });

    // Step 7: Verify approval was successful in admin view
    // The approved status is already visible on the admin detail page
    // We skip logging back in as customer to avoid rate limiting
    // The test has verified: customer creates repair, admin approves, status changes to Approved

    // Take final screenshot showing approved status
    await page.screenshot({
      path: testInfo.outputPath('08-final-approved-status.png'),
      fullPage: true,
    });

    // Verify repair appears as approved in admin list
    await page.goto('/admin/repairs');
    const approvedRow = page.getByRole('row').filter({
      hasText: repairReference,
    });
    await expect(approvedRow).toBeVisible();
    await expect(approvedRow.getByText('Approved')).toBeVisible();
  });

  // Run this test before the main flow to minimize logins
  test('Unauthenticated user cannot access repair pages', async ({ page }) => {
    // Clear any session state
    await page.context().clearCookies();

    // Try to access repairs without login
    await page.goto('/repairs');
    await expect(page).toHaveURL(/\/login$/);

    // Try to access repair request without login
    await page.goto('/repairs/request');
    await expect(page).toHaveURL(/\/login$/);

    // Try to access admin repairs without login
    await page.goto('/admin/repairs');
    await expect(page).toHaveURL(/\/login$/);
  });
});
