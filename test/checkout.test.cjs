const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const {
  initialDelivery,
  normalizeDelivery,
  validateDelivery,
  checkoutChanges,
} = loadTypeScript(
  path.resolve(
    __dirname,
    '../src/pages/Customer/Checkout/helpers/checkout.helpers.ts',
  ),
);
const valid = () => ({
  ...initialDelivery('customer@example.com'),
  firstName: 'Test',
  lastName: 'Customer',
  phone: '0771234567',
  addressLine1: '123 Test Road',
  city: 'Colombo',
  postalCode: '00100',
});
test('delivery starts with the account email and no stored address', () => {
  const draft = initialDelivery('user@example.com');
  assert.equal(draft.email, 'user@example.com');
  assert.equal(draft.addressLine1, '');
  assert.equal(draft.countryCode, 'LK');
});
test('required delivery fields reject missing and whitespace-only input', () => {
  for (const field of [
    'firstName',
    'lastName',
    'email',
    'phone',
    'addressLine1',
    'city',
    'postalCode',
    'countryCode',
  ]) {
    assert.ok(validateDelivery({ ...valid(), [field]: '   ' })[field]);
  }
});
test('normalization trims contact details, uppercases country and omits empty optional address', () => {
  const delivery = normalizeDelivery({
    ...valid(),
    firstName: ' Test ',
    countryCode: ' lk ',
    addressLine2: ' ',
  });
  assert.equal(delivery.firstName, 'Test');
  assert.equal(delivery.countryCode, 'LK');
  assert.equal('addressLine2' in delivery, false);
  assert.deepEqual(
    Object.keys(delivery).sort(),
    [
      'firstName',
      'lastName',
      'email',
      'phone',
      'addressLine1',
      'city',
      'postalCode',
      'countryCode',
    ].sort(),
  );
});
test('valid local and international phone shapes pass while malformed fields fail', () => {
  for (const phone of ['0771234567', '+94771234567', '+44 7700 900123'])
    assert.equal(
      Object.keys(validateDelivery({ ...valid(), phone })).length,
      0,
    );
  for (const [field, value] of [
    ['email', 'bad'],
    ['phone', '123'],
    ['postalCode', '<bad>'],
    ['countryCode', 'Sri Lanka'],
    ['firstName', 'x'.repeat(81)],
    ['addressLine2', 'x'.repeat(201)],
  ])
    assert.ok(validateDelivery({ ...valid(), [field]: value })[field]);
});
test('price and quantity changes are detected even when total would be unchanged', () => {
  const cart = { items: [{ productId: 'p', quantity: 2, unitPrice: '1.00' }] };
  assert.equal(
    checkoutChanges(cart, {
      items: [{ productId: 'p', quantity: 1, unitPrice: '2.00' }],
    }).pricesChanged,
    true,
  );
  assert.equal(
    checkoutChanges(cart, {
      items: [{ productId: 'p', quantity: 1, unitPrice: '2.00' }],
    }).itemsChanged,
    true,
  );
  assert.equal(checkoutChanges(cart, { items: [] }).itemsChanged, true);
  assert.equal(
    checkoutChanges(cart, { items: cart.items }).pricesChanged,
    false,
  );
});
