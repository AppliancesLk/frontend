const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadTypeScript } = require('./helpers/load-typescript.cjs');
const { getAuthDestination } = loadTypeScript(
  path.resolve(__dirname, '../src/pages/Auth/helpers/auth.helpers.ts'),
);
const user = (role) => ({
  id: 'id',
  username: 'user',
  email: 'user@example.com',
  role,
});
const scenarios = [
  ['admin lands on dashboard', 'ADMIN', undefined, '/admin'],
  ['customer lands on account', 'CUSTOMER', undefined, '/account'],
  ['repairer lands on workspace', 'REPAIRER', undefined, '/repairer'],
  [
    'admin preserves management destination',
    'ADMIN',
    '/admin/inventory',
    '/admin/inventory',
  ],
  ['admin from shop lands on dashboard', 'ADMIN', '/products', '/admin'],
  [
    'customer cannot redirect into admin',
    'CUSTOMER',
    '/admin/products',
    '/account',
  ],
  [
    'customer cannot redirect into repairer workspace',
    'CUSTOMER',
    '/repairer',
    '/account',
  ],
  [
    'customer preserves shopping destination',
    'CUSTOMER',
    '/products?category=one',
    '/products?category=one',
  ],
  ['external redirects rejected', 'ADMIN', '//attacker.example', '/admin'],
  ['backslash redirects rejected', 'ADMIN', '/\\attacker.example', '/admin'],
  ['login loops rejected', 'CUSTOMER', '/login?next=one', '/account'],
];
for (const [title, role, requested, expected] of scenarios)
  test(title, () =>
    assert.equal(getAuthDestination(user(role), requested), expected),
  );
