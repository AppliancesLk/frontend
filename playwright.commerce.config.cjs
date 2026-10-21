module.exports = {
  ...require('./playwright.cart.config.cjs'),
  testMatch: 'commerce-accounts.spec.cjs',
  timeout: 90000,
};
