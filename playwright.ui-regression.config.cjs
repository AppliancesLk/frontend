const config = require(
  './' + (process.env.UI_REGRESSION_CONFIG || 'playwright.cart.config.cjs'),
);
module.exports = {
  ...config,
  timeout: 60000,
  expect: { timeout: 10000 },
  outputDir:
    'test-results/regression/' +
    (process.env.UI_REGRESSION_CONFIG || 'cart').replace(/[^a-z0-9]/gi, '_'),
};
