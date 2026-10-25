const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const helpers = loadTypeScript(
  path.resolve(
    __dirname,
    '../src/pages/Admin/Products/Edit/helpers/product-edit.helpers.ts',
  ),
);
const {
  createProductEditDraft,
  buildProductUpdateInput,
  isProductEditDirty,
  specificationEntriesToObject,
  toSpecificationDraft,
  specificationDraftValue,
} = helpers;
const { buildProductInput } = loadTypeScript(
  path.resolve(
    __dirname,
    '../src/pages/Admin/Products/helpers/product.helpers.ts',
  ),
);
const { productEditCache } = loadTypeScript(
  path.resolve(
    __dirname,
    '../src/pages/Admin/Products/Edit/helpers/product-edit-cache.ts',
  ),
);
const plain = (value) => JSON.parse(JSON.stringify(value));
function product() {
  return {
    productID: '7c60f45d-c8dd-42e0-bba4-19589f15978f',
    name: 'Washing machine',
    SKU: 'WM-001',
    price: '149990.50',
    stockQty: 7,
    images: ['https://example.com/front.jpg'],
    isActive: false,
    category: {
      categoryID: '7c60f45d-c8dd-42e0-bba4-19589f159780',
      name: 'Laundry',
      isActive: false,
      parent: null,
    },
    specifications: {
      Capacity: '8 kg',
      Smart: false,
      Power: 0,
      Programs: ['Cotton', 'Wool'],
      Dimensions: { width: 60, height: 85 },
      Warranty: null,
    },
  };
}
test('prefills inactive products without treating the initial values as edits', () => {
  const original = product();
  const draft = createProductEditDraft(original);
  assert.equal(draft.price, '149990.50');
  assert.equal(draft.isActive, false);
  assert.equal(draft.categoryID, original.category.categoryID);
  assert.equal(isProductEditDirty(draft, original), false);
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {});
});
test('a name edit sends only a trimmed name and never stock or specifications', () => {
  const original = product();
  const draft = {
    ...createProductEditDraft(original),
    name: '  Updated appliance  ',
  };
  assert.equal(isProductEditDirty(draft, original), true);
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    name: 'Updated appliance',
  });
});
test('typed specification values survive a round trip without becoming strings', () => {
  const original = product();
  const draft = createProductEditDraft(original);
  assert.deepEqual(
    plain(specificationEntriesToObject(draft.specifications)),
    original.specifications,
  );
});
test('editing one specification preserves other nested and boolean values', () => {
  const original = product();
  const draft = createProductEditDraft(original);
  draft.specifications = draft.specifications.map((entry) =>
    entry.name === 'Capacity'
      ? { ...entry, value: { kind: 'text', text: '9 kg' } }
      : entry,
  );
  draft.specificationsMode = 'replace';
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    specifications: { ...original.specifications, Capacity: '9 kg' },
  });
});
test('reordered but unchanged specifications do not produce a patch', () => {
  const original = product();
  const draft = createProductEditDraft(original);
  draft.specifications.reverse();
  draft.specificationsMode = 'replace';
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {});
  assert.equal(isProductEditDirty(draft, original), false);
});
test('image removal explicitly sends an empty array', () => {
  const original = product();
  const draft = { ...createProductEditDraft(original), imageUrls: '' };
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    images: [],
  });
});
test('clear specifications sends null while removing all rows sends an object', () => {
  const original = product();
  assert.deepEqual(
    plain(
      buildProductUpdateInput(
        {
          ...createProductEditDraft(original),
          specifications: [],
          specificationsMode: 'clear',
        },
        original,
      ),
    ),
    { specifications: null },
  );
  assert.deepEqual(
    plain(
      buildProductUpdateInput(
        {
          ...createProductEditDraft(original),
          specifications: [],
          specificationsMode: 'replace',
        },
        original,
      ),
    ),
    { specifications: {} },
  );
});
test('untouched null and empty specifications retain their original representation', () => {
  for (const specifications of [null, {}]) {
    const original = { ...product(), specifications };
    assert.deepEqual(
      plain(
        buildProductUpdateInput(createProductEditDraft(original), original),
      ),
      {},
    );
  }
});
test('zero price and activation are valid changes', () => {
  const original = product();
  const draft = {
    ...createProductEditDraft(original),
    price: '0',
    isActive: true,
  };
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    price: 0,
    isActive: true,
  });
});
test('changing categories does not include unrelated fields', () => {
  const original = product();
  const draft = {
    ...createProductEditDraft(original),
    categoryID: '7c60f45d-c8dd-42e0-bba4-19589f159781',
  };
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    categoryID: draft.categoryID,
  });
});
test('invalid prices, names, SKUs and edited image URLs are rejected', () => {
  const original = product();
  const draft = createProductEditDraft(original);
  for (const change of [
    { name: ' ' },
    { SKU: '' },
    { price: '-1' },
    { price: '1.001' },
    { price: '10000000000' },
    { imageUrls: 'javascript:alert(1)' },
  ])
    assert.throws(() =>
      buildProductUpdateInput({ ...draft, ...change }, original),
    );
});
test('unchanged legacy image strings do not prevent a detail edit', () => {
  const original = { ...product(), images: ['/legacy/image.jpg'] };
  assert.deepEqual(
    plain(
      buildProductUpdateInput(
        { ...createProductEditDraft(original), name: 'Updated' },
        original,
      ),
    ),
    { name: 'Updated' },
  );
});
test('blank and duplicate specification names are rejected', () => {
  for (const names of [[''], ['Capacity', 'Capacity']])
    assert.throws(() =>
      specificationEntriesToObject(
        names.map((name) => ({ name, value: { kind: 'text', text: '8 kg' } })),
      ),
    );
});
test('invalid numeric specification values are rejected', () => {
  for (const text of ['', ' ', 'NaN', 'Infinity'])
    assert.throws(() => specificationDraftValue({ kind: 'number', text }));
});
test('invalid specification edits stay dirty so navigation cannot silently discard them', () => {
  const original = product();
  const draft = {
    ...createProductEditDraft(original),
    specificationsMode: 'replace',
    specifications: [{ name: '', value: { kind: 'text', text: '' } }],
  };
  assert.equal(isProductEditDirty(draft, original), true);
});
test('deeply nested values are preserved losslessly', () => {
  let nested = { enabled: false };
  for (let i = 0; i < 12; i++) nested = { child: nested };
  assert.deepEqual(
    plain(specificationDraftValue(toSpecificationDraft(nested))),
    nested,
  );
});
test('specification names cannot change the object prototype', () => {
  const output = specificationEntriesToObject([
    {
      name: '__proto__',
      value: {
        kind: 'group',
        entries: [
          { name: 'polluted', value: { kind: 'boolean', value: true } },
        ],
      },
    },
  ]);
  assert.equal(Object.prototype.hasOwnProperty.call(output, '__proto__'), true);
  assert.equal({}.polluted, undefined);
});
test('unsaved drafts are scoped by account and product and can be discarded', () => {
  const original = product();
  const draft = { ...createProductEditDraft(original), name: 'Unsaved' };
  productEditCache.set('admin-a:product-a', { baseline: original, draft });
  assert.equal(productEditCache.get('admin-a:product-a').draft.name, 'Unsaved');
  assert.equal(productEditCache.get('admin-b:product-a'), undefined);
  productEditCache.delete('admin-a:product-a');
  assert.equal(productEditCache.get('admin-a:product-a'), undefined);
});
test('the shared form still builds valid creation payloads with initial stock', () => {
  const input = buildProductInput({
    name: ' Appliance ',
    SKU: ' SKU-2 ',
    price: '100.50',
    categoryID: product().category.categoryID,
    imageUrls: 'https://example.com/a.jpg',
    stockQty: '4',
    specifications: 'Capacity: 8 kg',
  });
  assert.equal(input.name, 'Appliance');
  assert.equal(input.stockQty, 4);
  assert.equal(input.price, 100.5);
  assert.deepEqual(plain(input.specifications), { Capacity: '8 kg' });
});

test('valid replacement image URLs are included in an edit', () => {
  const original = product();
  const draft = {
    ...createProductEditDraft(original),
    imageUrls: 'https://example.com/new.jpg\nhttps://example.com/back.jpg',
  };
  assert.deepEqual(plain(buildProductUpdateInput(draft, original)), {
    images: ['https://example.com/new.jpg', 'https://example.com/back.jpg'],
  });
});
