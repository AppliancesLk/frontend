# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-product-management.spec.cjs >> TC-E2E-002: Admin Product Management Flow >> Complete admin product management flow
- Location: e2e\journeys\admin-product-management.spec.cjs:62:3

# Error details

```
Error: Login rate limited - too many attempts
```

# Test source

```ts
  1   | /**
  2   |  * Authentication Helper Functions for E2E Tests
  3   |  *
  4   |  * Provides reusable login/logout functions with proper selectors.
  5   |  */
  6   | const { expect } = require('@playwright/test');
  7   | 
  8   | /**
  9   |  * Login using the application's login form
  10  |  * @param {import('@playwright/test').Page} page
  11  |  * @param {string} username
  12  |  * @param {string} password
  13  |  * @param {string} [destination] - Expected URL after login (optional)
  14  |  */
  15  | async function login(page, username, password, destination) {
  16  |   // Clear any existing session state before login
  17  |   await page.context().clearCookies();
  18  | 
  19  |   await page.goto('/login');
  20  | 
  21  |   // Wait for login form to be ready
  22  |   await expect(page.getByLabel('Username or email')).toBeVisible();
  23  | 
  24  |   // Check for rate limit error and wait if needed
  25  |   const rateLimitError = page.locator('[role="alert"]:has-text("Too many attempts")');
  26  |   if (await rateLimitError.isVisible()) {
  27  |     // If rate limited, wait before attempting login
  28  |     await page.waitForTimeout(5000);
  29  |     // Reload to clear error state
  30  |     await page.reload();
  31  |     await expect(page.getByLabel('Username or email')).toBeVisible();
  32  |   }
  33  | 
  34  |   // Fill login form using accessible selectors
  35  |   await page.getByLabel('Username or email').fill(username);
  36  |   await page.getByLabel('Password', { exact: true }).fill(password);
  37  | 
  38  |   // Click submit button
  39  |   await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  40  | 
  41  |   // Wait for successful navigation away from login
  42  |   // Also check for rate limit error that might appear after submission
  43  |   const maxWait = 20000;
  44  |   const pollInterval = 500;
  45  |   let elapsed = 0;
  46  | 
  47  |   while (elapsed < maxWait) {
  48  |     const currentUrl = page.url();
  49  |     if (!currentUrl.endsWith('/login')) {
  50  |       // Successfully logged in
  51  |       break;
  52  |     }
  53  | 
  54  |     // Check if rate limited
  55  |     if (await rateLimitError.isVisible()) {
> 56  |       throw new Error('Login rate limited - too many attempts');
      |             ^ Error: Login rate limited - too many attempts
  57  |     }
  58  | 
  59  |     await page.waitForTimeout(pollInterval);
  60  |     elapsed += pollInterval;
  61  |   }
  62  | 
  63  |   if (page.url().endsWith('/login')) {
  64  |     throw new Error('Login failed - still on login page after timeout');
  65  |   }
  66  | 
  67  |   // Navigate to destination if specified
  68  |   if (destination) {
  69  |     await page.goto(destination);
  70  |   }
  71  | }
  72  | 
  73  | /**
  74  |  * Login as customer
  75  |  * @param {import('@playwright/test').Page} page
  76  |  * @param {object} customer - Customer account from fixture
  77  |  * @param {string} [destination] - Optional destination after login
  78  |  */
  79  | async function loginAsCustomer(page, customer, destination) {
  80  |   await login(page, customer.username, customer.password, destination);
  81  | }
  82  | 
  83  | /**
  84  |  * Login as admin
  85  |  * @param {import('@playwright/test').Page} page
  86  |  * @param {object} admin - Admin account from fixture
  87  |  * @param {string} [destination] - Optional destination after login
  88  |  */
  89  | async function loginAsAdmin(page, admin, destination = '/admin') {
  90  |   await login(page, admin.username, admin.password);
  91  |   // Admin should be redirected to /admin by default
  92  |   await expect(page).toHaveURL(/\/admin/);
  93  |   if (destination && destination !== '/admin') {
  94  |     await page.goto(destination);
  95  |   }
  96  | }
  97  | 
  98  | /**
  99  |  * Login as repairer
  100 |  * @param {import('@playwright/test').Page} page
  101 |  * @param {object} repairer - Repairer account from fixture
  102 |  * @param {string} [destination] - Optional destination after login
  103 |  */
  104 | async function loginAsRepairer(page, repairer, destination = '/repairer') {
  105 |   await login(page, repairer.username, repairer.password);
  106 |   // Repairer should be redirected to /repairer by default
  107 |   await expect(page).toHaveURL(/\/repairer/);
  108 |   if (destination && destination !== '/repairer') {
  109 |     await page.goto(destination);
  110 |   }
  111 | }
  112 | 
  113 | /**
  114 |  * Logout from the application
  115 |  * @param {import('@playwright/test').Page} page
  116 |  */
  117 | async function logout(page) {
  118 |   // The sign out button may be in a dropdown on desktop
  119 |   const signOutButton = page.getByRole('button', {
  120 |     name: 'Sign out',
  121 |     exact: true,
  122 |   });
  123 | 
  124 |   // If not visible, try opening the account dropdown first
  125 |   // Use the account-trigger class to distinguish from other summary elements
  126 |   if (!(await signOutButton.isVisible())) {
  127 |     const accountDropdown = page.locator('summary.account-trigger');
  128 |     if (await accountDropdown.isVisible()) {
  129 |       await accountDropdown.click();
  130 |       // Wait for dropdown to open
  131 |       await expect(signOutButton).toBeVisible({ timeout: 5000 });
  132 |     }
  133 |   }
  134 | 
  135 |   await signOutButton.click();
  136 |   await expect(page).toHaveURL(/\/login$/);
  137 | 
  138 |   // Clear cookies to ensure clean state for next login
  139 |   await page.context().clearCookies();
  140 | }
  141 | 
  142 | module.exports = {
  143 |   login,
  144 |   loginAsCustomer,
  145 |   loginAsAdmin,
  146 |   loginAsRepairer,
  147 |   logout,
  148 | };
  149 | 
```