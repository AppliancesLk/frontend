/**
 * TC-E2E-002: Admin Product Management Flow
 *
 * Tests the admin product creation and editing workflow.
 *
 * Preconditions:
 * - Test admin account created
 * - Test category available
 * - Backend running with test database
 *
 * Flow:
 * 1. Login as admin
 * 2. Navigate to admin products page
 * 3. Open "Add product" dialog
 * 4. Fill product form
 * 5. Submit and verify success
 * 6. Find product in list
 * 7. Edit product
 * 8. Save and verify changes
 * 9. Verify product visible in customer catalog
 */
const { test, expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const {
  createJourneyFixture,
  cleanupJourneyFixture,
} = require('../fixtures/journey-fixture.cjs');
const {
  loginAsAdmin,
  loginAsCustomer,
  logout,
} = require('../helpers/auth.helpers.cjs');

let fixture;
let pageErrors = [];
let createdProductId = null;

test.describe('TC-E2E-002: Admin Product Management Flow', () => {
  test.beforeAll(async ({ playwright }) => {
    fixture = await createJourneyFixture(playwright);
  });

  test.afterAll(async () => {
    // Clean up any product created during tests
    if (createdProductId && fixture?.db) {
      await fixture.db.query('DELETE FROM products WHERE "productID"=$1', [
        createdProductId,
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

  test('Complete admin product management flow', async ({ page }, testInfo) => {
    const productSuffix = randomBytes(4).toString('hex');
    const productName = `E2E Admin Product ${productSuffix}`;
    const productSKU = `E2E-ADMIN-${productSuffix}`;

    // Step 1: Login as admin
    await loginAsAdmin(page, fixture.admin);

    // Verify admin dashboard
    await expect(
      page.getByRole('heading', { name: /store overview/i }),
    ).toBeVisible();

    // Take screenshot of admin dashboard
    await page.screenshot({
      path: testInfo.outputPath('01-admin-dashboard.png'),
      fullPage: true,
    });

    // Step 2: Navigate to admin products page
    await page.goto('/admin/products');
    await expect(
      page.getByRole('heading', { name: 'Products', exact: true }),
    ).toBeVisible();

    // Take screenshot of products list
    await page.screenshot({
      path: testInfo.outputPath('02-products-list.png'),
      fullPage: true,
    });

    // Step 3: Open "Add product" dialog
    await page
      .getByRole('button', { name: 'Add product', exact: true })
      .click();

    // Verify dialog opened - use first() since there may be multiple headings
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Step 4: Fill product form
    await page.getByLabel('Product name', { exact: true }).fill(productName);
    await page.getByLabel('SKU', { exact: true }).fill(productSKU);
    await page.getByLabel('Price (LKR)', { exact: true }).fill('12500.00');

    // Select category (use the test category created in fixture)
    const categorySelect = page.getByLabel('Category', { exact: true });
    await categorySelect.selectOption({ index: 1 }); // Select first non-empty option

    // Fill initial stock
    await page.getByLabel('Initial stock', { exact: true }).fill('25');

    // Take screenshot of filled form
    await page.screenshot({
      path: testInfo.outputPath('03-product-form-filled.png'),
      fullPage: true,
    });

    // Step 5: Submit and verify success
    const createResponse = page.waitForResponse(
      (res) =>
        res.url().includes('/products') &&
        res.request().method() === 'POST' &&
        !res.url().includes('/stock'),
    );

    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Add product', exact: true })
      .click();

    const response = await createResponse;
    expect(response.status()).toBe(201);
    const createdProduct = await response.json();
    createdProductId = createdProduct.productID;

    // Verify success message appears in the dialog
    await expect(
      page.getByRole('dialog').getByRole('status').filter({ hasText: 'Product added successfully' }),
    ).toBeVisible();

    // Close the dialog by clicking the close button
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Step 6: Find product in list
    // Use search to find the product
    const searchInput = page.getByPlaceholder(/search by name or sku/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill(productSKU);
    }

    // Verify product appears in list
    const productRow = page.getByRole('row').filter({
      hasText: productName,
    });
    await expect(productRow).toBeVisible();
    await expect(productRow.getByText('LKR 12,500.00')).toBeVisible();

    // Take screenshot of product in list
    await page.screenshot({
      path: testInfo.outputPath('04-product-in-list.png'),
      fullPage: true,
    });

    // Step 7: Edit product
    // Navigate to edit page
    await page.goto(`/admin/products/${createdProductId}/edit`);
    await expect(
      page.getByRole('heading', { name: 'Edit product' }),
    ).toBeVisible();

    // Wait for form to load with data
    await expect(page.getByLabel('Product name', { exact: true })).toHaveValue(
      productName,
    );

    // Update the price (label is 'Price (LKR)')
    const priceInput = page.getByLabel('Price (LKR)', { exact: true });
    await priceInput.fill('15000.00');

    // Update description (use 'Product description' label)
    const descriptionInput = page.getByLabel('Product description');
    if (await descriptionInput.isVisible()) {
      await descriptionInput.fill(
        'Updated E2E test product description. This is a test appliance for E2E testing.',
      );
    }

    // Take screenshot of edit form
    await page.screenshot({
      path: testInfo.outputPath('05-edit-form.png'),
      fullPage: true,
    });

    // Step 8: Save and verify changes
    const saveResponse = page.waitForResponse(
      (res) =>
        res.url().includes(`/products/${createdProductId}`) &&
        res.request().method() === 'PATCH',
    );

    await page
      .getByRole('button', { name: 'Save changes', exact: true })
      .click();

    const saveRes = await saveResponse;
    expect(saveRes.status()).toBe(200);

    // Verify success message
    await expect(
      page.getByRole('status').filter({ hasText: 'Product updated' }),
    ).toBeVisible();

    // Take screenshot after save
    await page.screenshot({
      path: testInfo.outputPath('06-product-saved.png'),
      fullPage: true,
    });

    // Verify changes persisted by reloading
    await page.reload();
    await expect(page.getByLabel('Price (LKR)', { exact: true })).toHaveValue(
      '15000.00',
    );

    // Step 9: Verify product visible in customer catalog
    // Logout as admin
    await logout(page);

    // Login as customer
    await loginAsCustomer(page, fixture.customer);

    // Go to products page and find the product
    await page.goto('/products');

    // Search or scroll to find the product
    // The product should be visible in the catalog
    await page.goto(`/products/${createdProductId}`);

    // Verify customer can see the product
    await expect(
      page.getByRole('heading', { name: productName }),
    ).toBeVisible();
    await expect(page.getByText('LKR 15,000.00')).toBeVisible();
    await expect(page.getByText('In stock')).toBeVisible();

    // Take screenshot of customer view
    await page.screenshot({
      path: testInfo.outputPath('07-customer-product-view.png'),
      fullPage: true,
    });
  });

  test('Admin can deactivate a product', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page, fixture.admin);

    // Navigate to edit page of test product
    await page.goto(`/admin/products/${fixture.testProduct.productID}/edit`);
    await expect(
      page.getByRole('heading', { name: 'Edit product' }),
    ).toBeVisible();

    // Find the active toggle/checkbox
    const activeToggle = page.getByLabel(/active/i);

    if (await activeToggle.isVisible()) {
      // Deactivate the product
      if (await activeToggle.isChecked()) {
        await activeToggle.uncheck();
      }

      // Save changes
      await page
        .getByRole('button', { name: 'Save changes', exact: true })
        .click();

      // Verify success
      await expect(
        page.getByRole('status').filter({ hasText: /updated/i }),
      ).toBeVisible();

      // Re-activate for other tests
      await activeToggle.check();
      await page
        .getByRole('button', { name: 'Save changes', exact: true })
        .click();
    }
  });

  test('Product form validates required fields', async ({ page }) => {
    // Login as admin
    await loginAsAdmin(page, fixture.admin);

    // Navigate to products page
    await page.goto('/admin/products');

    // Open add product dialog
    await page
      .getByRole('button', { name: 'Add product', exact: true })
      .click();

    // Try to submit without filling required fields
    const submitButton = page
      .getByRole('dialog')
      .getByRole('button', { name: 'Add product', exact: true });

    // Click submit - form validation should prevent submission
    await submitButton.click();

    // The dialog should still be open (form not submitted)
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill only name, leave other required fields empty
    await page.getByLabel('Product name', { exact: true }).fill('Incomplete');
    await submitButton.click();

    // Still should not submit without SKU and price
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('Admin cannot access with customer account', async ({ page }) => {
    // Login as customer
    await loginAsCustomer(page, fixture.customer);

    // Try to access admin products page
    await page.goto('/admin/products');

    // Should be redirected to forbidden
    await expect(page).toHaveURL(/\/forbidden$/);
    await expect(
      page.getByRole('heading', { name: /access restricted/i }),
    ).toBeVisible();
  });
});
