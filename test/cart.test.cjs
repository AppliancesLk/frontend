const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { nextQuantity } = loadTypeScript(
  path.resolve(__dirname, '../src/pages/Customer/Cart/helpers/cart.helpers.ts'),
);
const { formatCurrency } = loadTypeScript(
  path.resolve(__dirname, '../src/utils/currency.ts'),
);
const item = { quantity: 1, stockQty: 3, isAvailable: true };
test('quantity cannot drop below one or exceed available stock', () => {
  assert.equal(nextQuantity(item, -1), null);
  assert.equal(nextQuantity(item, 1), 2);
  assert.equal(nextQuantity({ ...item, quantity: 3 }, 1), null);
});
test('a stock reduction can be corrected in one valid decrease', () => {
  assert.equal(
    nextQuantity({ ...item, quantity: 8, isAvailable: false }, -1),
    3,
  );
});
test('unavailable products cannot increase or decrement to zero', () => {
  for (const unavailable of [
    { ...item, stockQty: 0, isAvailable: false },
    { ...item, isAvailable: false },
  ]) {
    assert.equal(nextQuantity(unavailable, 1), null);
    assert.equal(nextQuantity(unavailable, -1), null);
  }
});
test('backend decimal totals retain every digit when displayed', () => {
  assert.equal(formatCurrency('0.10'), 'LKR 0.10');
  assert.equal(
    formatCurrency('21474836469978525163.53'),
    'LKR 21,474,836,469,978,525,163.53',
  );
  assert.equal(formatCurrency(1234.5), 'LKR 1,234.50');
});
