const { expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const { createRequire } = require('node:module');
const fs = require('node:fs');
const path = require('node:path');
const backendPath =
  process.env.CART_BACKEND_DIR || path.resolve(__dirname, '../../../backend');
const backendRequire = createRequire(path.join(backendPath, 'package.json'));
const { Client } = backendRequire('pg');
const { parse } = backendRequire('dotenv');
const backendUrl = process.env.CART_BACKEND_URL || 'http://localhost:3001';
const frontendUrl = process.env.CART_FRONTEND_URL || 'http://localhost:5174';

async function createShopFixture(playwright) {
  let fixture;
  try {
    const file = path.join(backendPath, '.env');
    const env = {
      ...(fs.existsSync(file) ? parse(fs.readFileSync(file)) : {}),
      ...process.env,
    };
    const db = new Client({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      connectionTimeoutMillis: 10000,
    });
    await db.connect();
    fixture = { db, users: [], products: [], categoryId: null };
    const suffix = randomBytes(6).toString('hex');
    const extraHTTPHeaders = {
      Origin: frontendUrl,
      'X-Requested-With': 'XMLHttpRequest',
    };
    const register = async (role) => {
      const api = await playwright.request.newContext({
        baseURL: backendUrl,
        extraHTTPHeaders,
      });
      const username = `cart_${role}_${suffix}`;
      const password = randomBytes(20).toString('hex');
      const result = await api.post('/auth/register', {
        data: { username, password, email: `${username}@example.com` },
      });
      expect(result.status()).toBe(201);
      expect((await result.json()).requiresVerification).toBe(true);
      const registered = (
        await db.query('SELECT id FROM users WHERE email=$1', [
          `${username}@example.com`,
        ])
      ).rows[0];
      fixture.users.push(registered.id);
      const inbox = await api.get('/_test/mailbox', {
        params: { email: `${username}@example.com` },
      });
      const mail = (await inbox.json()).messages.findLast((message) =>
        message.subject.includes('Verify your'),
      );
      const token = mail?.text.match(/#token=([a-f0-9]{64})/)?.[1];
      expect(token).toBeTruthy();
      expect(
        (await api.post('/auth/verify-email', { data: { token } })).status(),
      ).toBe(201);
      const login = await api.post('/auth/login', {
        data: { username, password },
      });
      expect(login.status()).toBe(201);
      const user = (await login.json()).user;
      return { api, username, password, id: user.id };
    };
    fixture.admin = await register('admin');
    fixture.customer = await register('customer');
    await db.query('UPDATE users SET role=$1 WHERE id=$2', [
      'ADMIN',
      fixture.admin.id,
    ]);
    const category = await fixture.admin.api.post('/categories', {
      data: { name: `Cart UI ${suffix}` },
    });
    expect(category.status()).toBe(201);
    fixture.categoryId = (await category.json()).categoryID;
    const createProduct = async (name, price, stockQty) => {
      const response = await fixture.admin.api.post('/products', {
        data: {
          name: `${name} ${suffix}`,
          SKU: `${name}-${suffix}`,
          price,
          stockQty,
          categoryID: fixture.categoryId,
          images: [],
        },
      });
      expect(response.status()).toBe(201);
      const product = await response.json();
      fixture.products.push(product.productID);
      return product;
    };
    fixture.washer = await createProduct('Cart test washer', 1234.5, 3);
    fixture.kettle = await createProduct('Cart test kettle', 0.1, 5);
    return fixture;
  } catch (error) {
    await cleanupShopFixture(fixture);
    throw error;
  }
}
async function cleanupShopFixture(fixture) {
  if (!fixture) return;
  try {
    if (fixture.users.length) {
      await fixture.db.query(
        'DELETE FROM payments WHERE "customerId" = ANY($1::uuid[])',
        [fixture.users],
      );
      await fixture.db.query(
        'DELETE FROM orders WHERE "customerId" = ANY($1::uuid[])',
        [fixture.users],
      );
    }
    for (const id of fixture.users)
      await fixture.db.query('DELETE FROM users WHERE id=$1', [id]);
    for (const id of fixture.products)
      await fixture.db.query('DELETE FROM products WHERE "productID"=$1', [id]);
    if (fixture.categoryId)
      await fixture.db.query('DELETE FROM categories WHERE "categoryID"=$1', [
        fixture.categoryId,
      ]);
  } finally {
    await fixture.admin?.api.dispose();
    await fixture.customer?.api.dispose();
    await fixture.db.end();
  }
}
module.exports = { createShopFixture, cleanupShopFixture, backendUrl };
