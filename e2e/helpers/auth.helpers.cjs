/**
 * Authentication Helper Functions for E2E Tests
 *
 * Provides reusable login/logout functions with proper selectors.
 */
const { expect } = require('@playwright/test');

/**
 * Login using the application's login form
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 * @param {string} [destination] - Expected URL after login (optional)
 */
async function login(page, username, password, destination) {
  // Clear any existing session state before login
  await page.context().clearCookies();

  await page.goto('/login');

  // Wait for login form to be ready
  await expect(page.getByLabel('Username or email')).toBeVisible();

  // Check for rate limit error and wait if needed
  const rateLimitError = page.locator('[role="alert"]:has-text("Too many attempts")');
  if (await rateLimitError.isVisible()) {
    // If rate limited, wait before attempting login
    await page.waitForTimeout(5000);
    // Reload to clear error state
    await page.reload();
    await expect(page.getByLabel('Username or email')).toBeVisible();
  }

  // Fill login form using accessible selectors
  await page.getByLabel('Username or email').fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);

  // Click submit button
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Wait for successful navigation away from login
  // Also check for rate limit error that might appear after submission
  const maxWait = 20000;
  const pollInterval = 500;
  let elapsed = 0;

  while (elapsed < maxWait) {
    const currentUrl = page.url();
    if (!currentUrl.endsWith('/login')) {
      // Successfully logged in
      break;
    }

    // Check if rate limited
    if (await rateLimitError.isVisible()) {
      throw new Error('Login rate limited - too many attempts');
    }

    await page.waitForTimeout(pollInterval);
    elapsed += pollInterval;
  }

  if (page.url().endsWith('/login')) {
    throw new Error('Login failed - still on login page after timeout');
  }

  // Navigate to destination if specified
  if (destination) {
    await page.goto(destination);
  }
}

/**
 * Login as customer
 * @param {import('@playwright/test').Page} page
 * @param {object} customer - Customer account from fixture
 * @param {string} [destination] - Optional destination after login
 */
async function loginAsCustomer(page, customer, destination) {
  await login(page, customer.username, customer.password, destination);
}

/**
 * Login as admin
 * @param {import('@playwright/test').Page} page
 * @param {object} admin - Admin account from fixture
 * @param {string} [destination] - Optional destination after login
 */
async function loginAsAdmin(page, admin, destination = '/admin') {
  await login(page, admin.username, admin.password);
  // Admin should be redirected to /admin by default
  await expect(page).toHaveURL(/\/admin/);
  if (destination && destination !== '/admin') {
    await page.goto(destination);
  }
}

/**
 * Login as repairer
 * @param {import('@playwright/test').Page} page
 * @param {object} repairer - Repairer account from fixture
 * @param {string} [destination] - Optional destination after login
 */
async function loginAsRepairer(page, repairer, destination = '/repairer') {
  await login(page, repairer.username, repairer.password);
  // Repairer should be redirected to /repairer by default
  await expect(page).toHaveURL(/\/repairer/);
  if (destination && destination !== '/repairer') {
    await page.goto(destination);
  }
}

/**
 * Logout from the application
 * @param {import('@playwright/test').Page} page
 */
async function logout(page) {
  // The sign out button may be in a dropdown on desktop
  const signOutButton = page.getByRole('button', {
    name: 'Sign out',
    exact: true,
  });

  // If not visible, try opening the account dropdown first
  // Use the account-trigger class to distinguish from other summary elements
  if (!(await signOutButton.isVisible())) {
    const accountDropdown = page.locator('summary.account-trigger');
    if (await accountDropdown.isVisible()) {
      await accountDropdown.click();
      // Wait for dropdown to open
      await expect(signOutButton).toBeVisible({ timeout: 5000 });
    }
  }

  await signOutButton.click();
  await expect(page).toHaveURL(/\/login$/);

  // Clear cookies to ensure clean state for next login
  await page.context().clearCookies();
}

module.exports = {
  login,
  loginAsCustomer,
  loginAsAdmin,
  loginAsRepairer,
  logout,
};
