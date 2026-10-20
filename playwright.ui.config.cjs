module.exports = {
  ...require('./playwright.home.config.cjs'),
  testMatch: ['ui-review.spec.cjs', 'chat.spec.cjs'],
  timeout: 300000,
  outputDir: 'test-results/ui-review',
  projects: [
    { name: 'ui-review', use: { viewport: { width: 1440, height: 1000 } } },
  ],
};
