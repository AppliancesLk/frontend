const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './test/e2e',
  testMatch: 'catalog.spec.cjs',
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  webServer: [
    {
      command: 'node test/helpers/start-cart-backend.cjs',
      url: 'http://localhost:3001/products',
      timeout: 60000,
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -- --host localhost --port 5174 --strictPort',
      url: 'http://localhost:5174',
      timeout: 30000,
      env: { VITE_API_URL: 'http://localhost:3001' },
      reuseExistingServer: false,
    },
  ],
  use: {
    baseURL: 'http://localhost:5174',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1680, height: 1050 } } },
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
