const base = require('./playwright.cart.config.cjs');
module.exports = {
  ...base,
  testMatch: 'seasonal-themes.spec.cjs',
  timeout: 90000,
};
