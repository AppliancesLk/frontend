/**
 * E2E Journey Test Fixture
 *
 * Creates test users (customer, admin, repairer), categories, and products
 * for the critical journey tests. Extends the shop-fixture pattern.
 */
const { expect } = require('@playwright/test');
const { randomBytes } = require('node:crypto');
const { createRequire } = require('node:module');
const fs = require('node:fs');
const path = require('node:path');

const backendPath =
  process.env.E2E_BACKEND_DIR ||
  process.env.CART_BACKEND_DIR ||
  path.resolve(__dirname, '../../../backend');
const backendRequire = createRequire(path.join(backendPath, 'package.json'));
const { Client } = backendRequire('pg');
const { parse } = backendRequire('dotenv');

const backendUrl =
  process.env.E2E_BACKEND_URL ||
  process.env.CART_BACKEND_URL ||
  'http://localhost:3001';
const frontendUrl =
  process.env.E2E_FRONTEND_URL ||
  process.env.CART_FRONTEND_URL ||
  'http://localhost:5174';

/**
 * Creates test fixture with customer, admin, repairer accounts and test products
 */
async function createJourneyFixture(playwright) {
  let fixture;
  try {
    // Load backend environment
    const file = path.join(backendPath, '.env');
    const env = {
      ...(fs.existsSync(file) ? parse(fs.readFileSync(file)) : {}),
      ...process.env,
    };

    // Connect to database
    const db = new Client({
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      connectionTimeoutMillis: 10000,
    });
    await db.connect();

    fixture = {
      db,
      users: [],
      products: [],
      categoryId: null,
      repairs: [],
      orders: [],
    };

    const suffix = randomBytes(6).toString('hex');
    const extraHTTPHeaders = {
      Origin: frontendUrl,
      'X-Requested-With': 'XMLHttpRequest',
    };

    /**
     * Sleep helper for rate limiting
     */
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * Register and verify a user account
     */
    const register = async (role, retries = 3) => {
      const api = await playwright.request.newContext({
        baseURL: backendUrl,
        extraHTTPHeaders,
      });

      const username = `e2e_${role}_${suffix}`;
      const password = randomBytes(20).toString('hex');
      const email = `${username}@example.com`;

      // Register with retry logic for rate limiting
      let result;
      for (let attempt = 0; attempt < retries; attempt++) {
        result = await api.post('/auth/register', {
          data: { username, password, email },
        });
        if (result.status() === 429) {
          // Rate limited - wait and retry
          const waitTime = (attempt + 1) * 2000; // 2s, 4s, 6s
          await sleep(waitTime);
          continue;
        }
        break;
      }
      expect(result.status()).toBe(201);
      expect((await result.json()).requiresVerification).toBe(true);

      // Get user ID
      const registered = (
        await db.query('SELECT id FROM users WHERE email=$1', [email])
      ).rows[0];
      fixture.users.push(registered.id);

      // Get verification token from test mailbox
      const inbox = await api.get('/_test/mailbox', {
        params: { email },
      });
      const mail = (await inbox.json()).messages.findLast((message) =>
        message.subject.includes('Verify your'),
      );
      const token = mail?.text.match(/#token=([a-f0-9]{64})/)?.[1];
      expect(token).toBeTruthy();

      // Verify email
      expect(
        (await api.post('/auth/verify-email', { data: { token } })).status(),
      ).toBe(201);

      // Login with retry logic for rate limiting
      let login;
      for (let attempt = 0; attempt < retries; attempt++) {
        login = await api.post('/auth/login', {
          data: { username, password },
        });
        if (login.status() === 429) {
          // Rate limited - wait and retry
          const waitTime = (attempt + 1) * 2000;
          await sleep(waitTime);
          continue;
        }
        break;
      }
      expect(login.status()).toBe(201);
      const user = (await login.json()).user;

      return { api, username, password, email, id: user.id };
    };

    // Create accounts with delays to avoid rate limiting
    // The backend has aggressive rate limiting, so we need longer delays
    fixture.customer = await register('customer');
    await sleep(1500);
    fixture.admin = await register('admin');
    await sleep(1500);
    fixture.repairer = await register('repairer');
    await sleep(1000);

    // Upgrade roles
    await db.query('UPDATE users SET role=$1 WHERE id=$2', [
      'ADMIN',
      fixture.admin.id,
    ]);
    await db.query('UPDATE users SET role=$1 WHERE id=$2', [
      'REPAIRER',
      fixture.repairer.id,
    ]);

    // Create test category
    const category = await fixture.admin.api.post('/categories', {
      data: { name: `E2E Journey ${suffix}` },
    });
    expect(category.status()).toBe(201);
    fixture.categoryId = (await category.json()).categoryID;

    // Create test product
    const createProduct = async (name, price, stockQty) => {
      const response = await fixture.admin.api.post('/products', {
        data: {
          name: `${name} ${suffix}`,
          SKU: `E2E-${name.replace(/\s+/g, '-')}-${suffix}`,
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

    // Create products for testing
    fixture.testProduct = await createProduct('E2E Test Appliance', 9999.99, 10);

    return fixture;
  } catch (error) {
    await cleanupJourneyFixture(fixture);
    throw error;
  }
}

/**
 * Cleanup all test data
 */
async function cleanupJourneyFixture(fixture) {
  if (!fixture) return;

  try {
    // Clean up repairs
    if (fixture.repairs.length) {
      for (const id of fixture.repairs) {
        await fixture.db.query('DELETE FROM repair_tickets WHERE id=$1', [id]);
      }
    }

    // Clean up payments and orders
    if (fixture.users.length) {
      await fixture.db.query(
        'DELETE FROM payments WHERE "customerId" = ANY($1::uuid[])',
        [fixture.users],
      );
      await fixture.db.query(
        'DELETE FROM orders WHERE "customerId" = ANY($1::uuid[])',
        [fixture.users],
      );
      // Clean up repair tickets by customer
      await fixture.db.query(
        'DELETE FROM repair_tickets WHERE "customerId" = ANY($1::uuid[])',
        [fixture.users],
      );
    }

    // Clean up users
    for (const id of fixture.users) {
      await fixture.db.query('DELETE FROM users WHERE id=$1', [id]);
    }

    // Clean up products
    for (const id of fixture.products) {
      await fixture.db.query('DELETE FROM products WHERE "productID"=$1', [id]);
    }

    // Clean up category
    if (fixture.categoryId) {
      await fixture.db.query('DELETE FROM categories WHERE "categoryID"=$1', [
        fixture.categoryId,
      ]);
    }
  } finally {
    await fixture.customer?.api.dispose();
    await fixture.admin?.api.dispose();
    await fixture.repairer?.api.dispose();
    await fixture.db.end();
  }
}

module.exports = {
  createJourneyFixture,
  cleanupJourneyFixture,
  backendUrl,
  frontendUrl,
};
