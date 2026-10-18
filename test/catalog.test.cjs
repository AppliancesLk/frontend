const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { readCatalogQuery, paginationPages } = loadTypeScript(
  path.resolve(__dirname, '../src/pages/Products/helpers/catalog.helpers.ts'),
);
const { createProductEditDraft, buildProductUpdateInput } = loadTypeScript(
  path.resolve(
    __dirname,
    '../src/pages/Admin/Products/Edit/helpers/product-edit.helpers.ts',
  ),
);
const plain = (value) => JSON.parse(JSON.stringify(value));
test('catalog links preserve search, category, brands, prices, sorting, and pages', () => {
  const query = readCatalogQuery(
    new URLSearchParams(
      'q=phone&category=7c60f45d-c8dd-42e0-bba4-19589f15978f&brands=Atlas,Nova&minPrice=0&maxPrice=1000.50&sort=price-desc&page=2',
    ),
  );
  assert.equal(query.page, 2);
  assert.equal(query.minPrice, 0);
  assert.equal(query.maxPrice, 1000.5);
  assert.equal(query.brands, 'Atlas,Nova');
  assert.equal(query.limit, 12);
});
test('malformed catalog URLs cannot produce unsafe or unbounded requests', () => {
  for (const params of [
    'page=0',
    'page=Infinity',
    'category=invalid',
    'minPrice=-1',
    'minPrice=1.001',
    'minPrice=50&maxPrice=20',
    'sort=popular',
    'brands=' + Array(21).fill('a').join(','),
    'q=' + 'x'.repeat(121),
  ])
    assert.equal(readCatalogQuery(new URLSearchParams(params)), null, params);
});
test('pagination keeps first, last, and neighboring pages without rendering every page', () => {
  assert.deepEqual(plain(paginationPages(50, 100)), [
    1,
    'ellipsis',
    49,
    50,
    51,
    'ellipsis',
    100,
  ]);
  assert.deepEqual(plain(paginationPages(1, 2)), [1, 2]);
  assert.deepEqual(plain(paginationPages(1, 0)), []);
});
const product = {
  productID: 'id',
  name: 'Phone',
  SKU: 'SKU',
  price: '100.00',
  stockQty: 3,
  images: [],
  category: { categoryID: 'category' },
  isActive: true,
  specifications: null,
  brand: 'Atlas',
  subtitle: '128 GB',
  badge: 'DEAL',
  compareAtPrice: '150.00',
};
test('metadata edits send only changed fields, and nullable metadata can be cleared', () => {
  const draft = createProductEditDraft(product);
  assert.deepEqual(
    plain(
      buildProductUpdateInput(
        { ...draft, brand: 'Nova', badge: '', compareAtPrice: '' },
        product,
      ),
    ),
    { brand: 'Nova', badge: null, compareAtPrice: null },
  );
  assert.deepEqual(plain(buildProductUpdateInput(draft, product)), {});
});
test('invalid original prices and ambiguous brands are rejected before submission', () => {
  const draft = createProductEditDraft(product);
  assert.throws(() =>
    buildProductUpdateInput({ ...draft, compareAtPrice: '90' }, product),
  );
  assert.throws(() =>
    buildProductUpdateInput({ ...draft, brand: 'Atlas,Nova' }, product),
  );
});
