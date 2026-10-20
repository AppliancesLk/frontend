const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './test/e2e',
  testMatch: 'redesign.spec.cjs',
  outputDir: './test-results/redesign',
  workers: 1,
  timeout: 45000,
  reporter: 'list',
  webServer: {
    command:
      'node node_modules/vite/bin/vite.js --host localhost --port 5180 --strictPort',
    url: 'http://localhost:5180',
    reuseExistingServer: !process.env.CI,
    env: { VITE_API_URL: 'http://localhost:3099' },
  },
  use: {
    baseURL: 'http://localhost:5180',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
  },
});
