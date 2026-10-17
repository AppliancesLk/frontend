const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { getProductImages, formatSpecificationValue, isProductId } =
  loadTypeScript(
    path.resolve(
      __dirname,
      '../src/pages/Customer/ProductDetails/helpers/product-details.helpers.ts',
    ),
  );
test('gallery removes empty and repeated image URLs while preserving order', () => {
  const images = getProductImages([
    ' https://example.com/front.jpg ',
    '',
    'https://example.com/front.jpg',
    'https://example.com/back.jpg',
  ]);
  assert.equal(
    JSON.stringify(images),
    JSON.stringify([
      'https://example.com/front.jpg',
      'https://example.com/back.jpg',
    ]),
  );
});
test('missing gallery images are supported', () =>
  assert.equal(getProductImages([]).length, 0));
test('valid UUID product links are accepted', () =>
  assert.equal(isProductId('7c60f45d-c8dd-42e0-bba4-19589f15978f'), true));
test('malformed and missing identifiers are rejected before requesting data', () => {
  for (const id of [
    undefined,
    '',
    'admin/all',
    '../auth/profile',
    'not-a-product',
  ])
    assert.equal(isProductId(id), false);
});
test('zero and false specification values are retained', () => {
  assert.equal(formatSpecificationValue(0), '0');
  assert.equal(formatSpecificationValue(false), 'No');
  assert.equal(formatSpecificationValue(true), 'Yes');
});
test('missing specification values have readable fallback text', () => {
  for (const value of [null, undefined, '', [], {}])
    assert.equal(formatSpecificationValue(value), 'Not specified');
});
test('arrays and nested specification objects are readable without object placeholders', () => {
  assert.equal(formatSpecificationValue(['Cotton', 'Wool']), 'Cotton, Wool');
  assert.equal(
    formatSpecificationValue({ Width: '60 cm', Height: '85 cm' }),
    'Width: 60 cm; Height: 85 cm',
  );
});
