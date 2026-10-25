const base = require('./playwright.cart.config.cjs');
module.exports = { ...base, testMatch: 'promotions.spec.cjs', timeout: 90000 };
