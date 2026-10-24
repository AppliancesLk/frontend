/**
 * Playwright Configuration for Critical E2E Journey Tests
 *
 * TC-E2E-001: Customer Purchase Flow
 * TC-E2E-002: Admin Product Management Flow
 * TC-E2E-003: Repair Service Flow
 *
 * These tests require both frontend and backend running with a test database.
 */
const { defineConfig } = require('@playwright/test');

const frontendUrl = process.env.E2E_FRONTEND_URL || 'http://localhost:5174';
const backendUrl = process.env.E2E_BACKEND_URL || 'http://localhost:3001';

module.exports = defineConfig({
  testDir: './e2e/journeys',
  testMatch: '*.spec.cjs',

  // Run tests sequentially - these are full journey tests
  workers: 1,

  // Generous timeout for full user journeys
  timeout: 120000,

  // Expect timeout for assertions
  expect: {
    timeout: 10000,
  },

  // Retry once on failure for stability
  retries: process.env.CI ? 1 : 0,

  // Detailed reporter for debugging
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list']]
    : [['list'], ['html', { open: 'on-failure' }]],

  // Start frontend and backend for tests
  webServer: [
    {
      command: 'node test/helpers/start-cart-backend.cjs',
      url: `${backendUrl}/products`,
      timeout: 60000,
      env: {
        E2E_FRONTEND_URL: frontendUrl,
        E2E_BACKEND_URL: backendUrl,
        CART_FRONTEND_URL: frontendUrl,
        CART_BACKEND_URL: backendUrl,
      },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run dev -- --host localhost --port ${new URL(frontendUrl).port} --strictPort`,
      url: frontendUrl,
      timeout: 30000,
      env: {
        VITE_API_URL: backendUrl,
      },
      reuseExistingServer: !process.env.CI,
    },
  ],

  use: {
    baseURL: frontendUrl,
    browserName: 'chromium',
    headless: true,

    // Capture evidence on failures
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',

    // Viewport for consistent testing
    viewport: { width: 1440, height: 900 },

    // Action timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  // Output directory for test artifacts
  outputDir: './e2e/test-results',

  // Single desktop project - keep it simple
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
