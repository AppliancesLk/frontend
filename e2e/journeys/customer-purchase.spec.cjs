/**
 * TC-E2E-001: Customer Purchase Flow
 *
 * Tests the complete customer purchase journey from login to order confirmation.
 *
 * Preconditions:
 * - Test customer account created
 * - Test product with stock available
 * - Backend running with test database
 *
 * Flow:
 * 1. Login as customer
 * 2. Browse products page
 * 3. Open a product
 * 4. Add product to cart
 * 5. Go to cart
 * 6. Proceed to checkout
 * 7. Fill delivery form
 * 8. Prepare checkout
 * 9. Place cash on delivery order
 * 10. Verify order confirmation
 */
const { test, expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const {
  createJourneyFixture,
  cleanupJourneyFixture,
  backendUrl,
} = require('../fixtures/journey-fixture.cjs');
const { loginAsCustomer, logout } = require('../helpers/auth.helpers.cjs');

let fixture;
let pageErrors = [];

test.describe('TC-E2E-001: Customer Purchase Flow', () => {
  test.beforeAll(async ({ playwright }) => {
    fixture = await createJourneyFixture(playwright);
  });

  test.afterAll(async () => {
    await cleanupJourneyFixture(fixture);
  });

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    // Clear cart before each test
    await fixture.customer.api.delete('/cart');

    // Ensure product is active and has stock
    await fixture.admin.api.patch(
      `/products/${fixture.testProduct.productID}`,
      {
        data: { isActive: true },
      },
    );
    await fixture.admin.api.patch(
      `/products/${fixture.testProduct.productID}/stock`,
      {
        data: { stockQty: 10 },
      },
    );
  });

  test.afterEach(() => {
    expect(pageErrors).toEqual([]);
  });

  test('Complete purchase flow from login to order confirmation', async ({
    page,
  }, testInfo) => {
    // Step 1: Login as customer
    await loginAsCustomer(page, fixture.customer);

    // Step 2: Browse products page
    await page.goto('/products');
    await expect(
      page.getByRole('heading', { name: /products/i }).first(),
    ).toBeVisible();

    // Step 3: Open the test product
    await page.goto(`/products/${fixture.testProduct.productID}`);
    await expect(
      page.getByRole('heading', { name: fixture.testProduct.name }),
    ).toBeVisible();

    // Verify product details are displayed
    await expect(page.getByText('LKR 9,999.99')).toBeVisible();
    await expect(page.getByText('In stock')).toBeVisible();

    // Step 4: Add product to cart
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();

    // Verify success feedback
    await expect(
      page.getByRole('status').filter({ hasText: 'Added to your cart.' }),
    ).toBeVisible();

    // Take screenshot of product page with cart feedback
    await page.screenshot({
      path: testInfo.outputPath('01-product-added-to-cart.png'),
    });

    // Step 5: Go to cart - use first() since there may be multiple cart links
    await page.getByRole('link', { name: 'View cart', exact: true }).first().click();
    await expect(page).toHaveURL(/\/cart$/);

    // Verify cart contains the product
    const cartItem = page.getByRole('listitem').filter({
      has: page.getByRole('heading', { name: fixture.testProduct.name }),
    });
    await expect(cartItem).toBeVisible();
    await expect(cartItem.getByText('LKR 9,999.99')).toBeVisible();

    // Verify cart summary - use first() for desktop-visible price element
    const summary = page.getByRole('complementary', { name: 'Cart summary' });
    await expect(
      summary.getByText('LKR 9,999.99', { exact: true }).first(),
    ).toBeVisible();

    // Take screenshot of cart
    await page.screenshot({
      path: testInfo.outputPath('02-cart-with-product.png'),
      fullPage: true,
    });

    // Step 6: Proceed to checkout
    await summary
      .getByRole('link', { name: /Proceed to checkout/i })
      .click();
    await expect(page).toHaveURL(/\/checkout$/);

    // Verify checkout page loaded
    await expect(
      page.getByRole('heading', { name: /delivery information/i }),
    ).toBeVisible();

    // Verify order summary shows product
    const orderSummary = page.getByRole('complementary', {
      name: 'Order summary',
    });
    await expect(
      orderSummary.getByText(fixture.testProduct.name, { exact: true }),
    ).toBeVisible();

    // Step 7: Fill delivery form
    await page.getByLabel('First name', { exact: true }).fill('E2E');
    await page.getByLabel('Last name', { exact: true }).fill('Customer');
    await page
      .getByLabel('Email address', { exact: true })
      .fill('e2e-purchase@example.com');
    await page.getByLabel('Phone number', { exact: true }).fill('0771234567');
    await page
      .getByLabel('Address line 1', { exact: true })
      .fill('123 E2E Test Street');
    await page.getByLabel(/^Address line 2/).fill('Apt 1');
    await page.getByLabel('City', { exact: true }).fill('Colombo');
    await page.getByLabel('Postal code', { exact: true }).fill('00100');
    await page.getByLabel('Country code', { exact: true }).fill('LK');

    // Take screenshot of filled delivery form
    await page.screenshot({
      path: testInfo.outputPath('03-delivery-form-filled.png'),
      fullPage: true,
    });

    // Step 8: Prepare checkout
    const prepareButton = page.getByRole('button', {
      name: 'Prepare checkout',
      exact: true,
    });
    await prepareButton.click();

    // Wait for checkout to be ready
    await expect(
      page.getByRole('heading', {
        name: 'Checkout ready for payment',
        exact: true,
      }),
    ).toBeVisible();

    // Verify validated amount
    await expect(
      orderSummary.getByText('LKR 9,999.99', { exact: true }).last(),
    ).toBeVisible();

    // Take screenshot of ready checkout
    await page.screenshot({
      path: testInfo.outputPath('04-checkout-ready.png'),
      fullPage: true,
    });

    // Step 9: Place cash on delivery order
    // Find and click the COD button
    const codButton = page.getByRole('button', {
      name: 'Place cash on delivery order',
      exact: true,
    });
    await expect(codButton).toBeVisible();

    // Wait for order creation response
    const orderResponse = page.waitForResponse(
      (res) => res.url().includes('/orders') && res.request().method() === 'POST',
    );
    await codButton.click();
    const response = await orderResponse;
    expect(response.status()).toBe(201);
    const order = await response.json();

    // Step 10: Verify order confirmation
    await expect(page).toHaveURL(new RegExp(`/orders/${order.id}$`));
    await expect(
      page.getByRole('heading', { name: 'Order details' }),
    ).toBeVisible();

    // Verify order shows the product
    await expect(
      page.getByRole('heading', { name: fixture.testProduct.name }),
    ).toBeVisible();

    // Verify order shows on the order details page
    await expect(page.getByText(/Order number/i)).toBeVisible();

    // Verify delivery address
    await expect(page.getByText('123 E2E Test Street')).toBeVisible();
    await expect(page.getByText('Colombo')).toBeVisible();

    // Take screenshot of order confirmation
    await page.screenshot({
      path: testInfo.outputPath('05-order-confirmation.png'),
      fullPage: true,
    });

    // Verify order appears in customer's order list
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'Your orders' })).toBeVisible();
    // Verify order row contains the order ID
    await expect(
      page.getByText(order.id.slice(0, 8).toUpperCase()),
    ).toBeVisible();

    // Take final screenshot
    await page.screenshot({
      path: testInfo.outputPath('06-orders-list.png'),
      fullPage: true,
    });
  });

  test('Cart preserves items after page reload', async ({ page }) => {
    // Login
    await loginAsCustomer(page, fixture.customer);

    // Add product to cart via API
    await fixture.customer.api.post('/cart/items', {
      data: { productId: fixture.testProduct.productID, quantity: 2 },
    });

    // Go to cart
    await page.goto('/cart');

    // Verify cart contents
    const cartItem = page.getByRole('listitem').filter({
      has: page.getByRole('heading', { name: fixture.testProduct.name }),
    });
    await expect(cartItem).toBeVisible();

    // Reload page
    await page.reload();

    // Verify cart still has items
    await expect(cartItem).toBeVisible();
    const summary = page.getByRole('complementary', { name: 'Cart summary' });
    // Price should be 2 x 9999.99 = 19999.98 - use first() for desktop price
    await expect(
      summary.getByText('LKR 19,999.98', { exact: true }).first(),
    ).toBeVisible();
  });

  test('Cart shows stock warning when quantity exceeds available', async ({ page }) => {
    // Login
    await loginAsCustomer(page, fixture.customer);

    // Add product via API with high quantity
    await fixture.customer.api.post('/cart/items', {
      data: { productId: fixture.testProduct.productID, quantity: 5 },
    });

    // Reduce stock while customer has items in cart
    await fixture.admin.api.patch(
      `/products/${fixture.testProduct.productID}/stock`,
      {
        data: { stockQty: 2 },
      },
    );

    // Go to cart page
    await page.goto('/cart');

    // Reload to fetch fresh data
    await page.reload();

    // Verify cart shows stock availability message
    await expect(
      page.getByText(/available stock has changed|available.*2/i),
    ).toBeVisible();

    // The proceed to checkout button should be disabled
    await expect(
      page.getByRole('link', { name: /proceed to checkout/i }),
    ).not.toBeVisible();
  });

  test('Unauthenticated user redirected to login', async ({ page }) => {
    // Try to access cart without login
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login$/);

    // Try to access checkout without login
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login$/);

    // Login should redirect back to intended destination
    await page.getByLabel('Username or email').fill(fixture.customer.username);
    await page
      .getByLabel('Password', { exact: true })
      .fill(fixture.customer.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    // Should be redirected to checkout
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
