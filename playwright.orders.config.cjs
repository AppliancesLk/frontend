const config = require('./playwright.cart.config.cjs');
module.exports = { ...config, testMatch: 'orders.spec.cjs' };
