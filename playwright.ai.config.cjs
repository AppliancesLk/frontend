const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './test/e2e',
  testMatch: 'ai.spec.cjs',
  workers: 1,
  timeout: 30000,
  reporter: 'list',
  webServer: {
    command: 'npm run dev -- --host localhost --port 5175 --strictPort',
    url: 'http://localhost:5175',
    timeout: 30000,
    reuseExistingServer: false,
  },
  use: {
    baseURL: 'http://localhost:5175',
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
