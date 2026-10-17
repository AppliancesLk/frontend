const { defineConfig } = require('@playwright/test');
const frontendUrl = process.env.CART_FRONTEND_URL || 'http://localhost:5174';
const backendUrl = process.env.CART_BACKEND_URL || 'http://localhost:3001';
module.exports = defineConfig({
  testDir: './test/e2e',
  testMatch: 'cart.spec.cjs',
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  webServer: [
    {
      command: 'node test/helpers/start-cart-backend.cjs',
      url: `${backendUrl}/products`,
      timeout: 60000,
      env: { CART_FRONTEND_URL: frontendUrl, CART_BACKEND_URL: backendUrl },
      reuseExistingServer: false,
    },
    {
      command: `npm run dev -- --host localhost --port ${new URL(frontendUrl).port} --strictPort`,
      url: frontendUrl,
      timeout: 30000,
      env: { VITE_API_URL: backendUrl },
      reuseExistingServer: false,
    },
  ],
  use: {
    baseURL: frontendUrl,
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    {
      name: 'mobile',
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
