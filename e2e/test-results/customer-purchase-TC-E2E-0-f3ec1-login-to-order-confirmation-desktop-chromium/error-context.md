# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customer-purchase.spec.cjs >> TC-E2E-001: Customer Purchase Flow >> Complete purchase flow from login to order confirmation
- Location: e2e\journeys\customer-purchase.spec.cjs:70:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 429
```

# Test source

```ts
  39  |       ...(fs.existsSync(file) ? parse(fs.readFileSync(file)) : {}),
  40  |       ...process.env,
  41  |     };
  42  | 
  43  |     // Connect to database
  44  |     const db = new Client({
  45  |       host: env.DB_HOST,
  46  |       port: Number(env.DB_PORT),
  47  |       user: env.DB_USERNAME,
  48  |       password: env.DB_PASSWORD,
  49  |       database: env.DB_NAME,
  50  |       connectionTimeoutMillis: 10000,
  51  |     });
  52  |     await db.connect();
  53  | 
  54  |     fixture = {
  55  |       db,
  56  |       users: [],
  57  |       products: [],
  58  |       categoryId: null,
  59  |       repairs: [],
  60  |       orders: [],
  61  |     };
  62  | 
  63  |     const suffix = randomBytes(6).toString('hex');
  64  |     const extraHTTPHeaders = {
  65  |       Origin: frontendUrl,
  66  |       'X-Requested-With': 'XMLHttpRequest',
  67  |     };
  68  | 
  69  |     /**
  70  |      * Sleep helper for rate limiting
  71  |      */
  72  |     const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  73  | 
  74  |     /**
  75  |      * Register and verify a user account
  76  |      */
  77  |     const register = async (role, retries = 3) => {
  78  |       const api = await playwright.request.newContext({
  79  |         baseURL: backendUrl,
  80  |         extraHTTPHeaders,
  81  |       });
  82  | 
  83  |       const username = `e2e_${role}_${suffix}`;
  84  |       const password = randomBytes(20).toString('hex');
  85  |       const email = `${username}@example.com`;
  86  | 
  87  |       // Register with retry logic for rate limiting
  88  |       let result;
  89  |       for (let attempt = 0; attempt < retries; attempt++) {
  90  |         result = await api.post('/auth/register', {
  91  |           data: { username, password, email },
  92  |         });
  93  |         if (result.status() === 429) {
  94  |           // Rate limited - wait and retry
  95  |           const waitTime = (attempt + 1) * 2000; // 2s, 4s, 6s
  96  |           await sleep(waitTime);
  97  |           continue;
  98  |         }
  99  |         break;
  100 |       }
  101 |       expect(result.status()).toBe(201);
  102 |       expect((await result.json()).requiresVerification).toBe(true);
  103 | 
  104 |       // Get user ID
  105 |       const registered = (
  106 |         await db.query('SELECT id FROM users WHERE email=$1', [email])
  107 |       ).rows[0];
  108 |       fixture.users.push(registered.id);
  109 | 
  110 |       // Get verification token from test mailbox
  111 |       const inbox = await api.get('/_test/mailbox', {
  112 |         params: { email },
  113 |       });
  114 |       const mail = (await inbox.json()).messages.findLast((message) =>
  115 |         message.subject.includes('Verify your'),
  116 |       );
  117 |       const token = mail?.text.match(/#token=([a-f0-9]{64})/)?.[1];
  118 |       expect(token).toBeTruthy();
  119 | 
  120 |       // Verify email
  121 |       expect(
  122 |         (await api.post('/auth/verify-email', { data: { token } })).status(),
  123 |       ).toBe(201);
  124 | 
  125 |       // Login with retry logic for rate limiting
  126 |       let login;
  127 |       for (let attempt = 0; attempt < retries; attempt++) {
  128 |         login = await api.post('/auth/login', {
  129 |           data: { username, password },
  130 |         });
  131 |         if (login.status() === 429) {
  132 |           // Rate limited - wait and retry
  133 |           const waitTime = (attempt + 1) * 2000;
  134 |           await sleep(waitTime);
  135 |           continue;
  136 |         }
  137 |         break;
  138 |       }
> 139 |       expect(login.status()).toBe(201);
      |                              ^ Error: expect(received).toBe(expected) // Object.is equality
  140 |       const user = (await login.json()).user;
  141 | 
  142 |       return { api, username, password, email, id: user.id };
  143 |     };
  144 | 
  145 |     // Create accounts with delays to avoid rate limiting
  146 |     // The backend has aggressive rate limiting, so we need longer delays
  147 |     fixture.customer = await register('customer');
  148 |     await sleep(1500);
  149 |     fixture.admin = await register('admin');
  150 |     await sleep(1500);
  151 |     fixture.repairer = await register('repairer');
  152 |     await sleep(1000);
  153 | 
  154 |     // Upgrade roles
  155 |     await db.query('UPDATE users SET role=$1 WHERE id=$2', [
  156 |       'ADMIN',
  157 |       fixture.admin.id,
  158 |     ]);
  159 |     await db.query('UPDATE users SET role=$1 WHERE id=$2', [
  160 |       'REPAIRER',
  161 |       fixture.repairer.id,
  162 |     ]);
  163 | 
  164 |     // Create test category
  165 |     const category = await fixture.admin.api.post('/categories', {
  166 |       data: { name: `E2E Journey ${suffix}` },
  167 |     });
  168 |     expect(category.status()).toBe(201);
  169 |     fixture.categoryId = (await category.json()).categoryID;
  170 | 
  171 |     // Create test product
  172 |     const createProduct = async (name, price, stockQty) => {
  173 |       const response = await fixture.admin.api.post('/products', {
  174 |         data: {
  175 |           name: `${name} ${suffix}`,
  176 |           SKU: `E2E-${name.replace(/\s+/g, '-')}-${suffix}`,
  177 |           price,
  178 |           stockQty,
  179 |           categoryID: fixture.categoryId,
  180 |           images: [],
  181 |         },
  182 |       });
  183 |       expect(response.status()).toBe(201);
  184 |       const product = await response.json();
  185 |       fixture.products.push(product.productID);
  186 |       return product;
  187 |     };
  188 | 
  189 |     // Create products for testing
  190 |     fixture.testProduct = await createProduct('E2E Test Appliance', 9999.99, 10);
  191 | 
  192 |     return fixture;
  193 |   } catch (error) {
  194 |     await cleanupJourneyFixture(fixture);
  195 |     throw error;
  196 |   }
  197 | }
  198 | 
  199 | /**
  200 |  * Cleanup all test data
  201 |  */
  202 | async function cleanupJourneyFixture(fixture) {
  203 |   if (!fixture) return;
  204 | 
  205 |   try {
  206 |     // Clean up repairs
  207 |     if (fixture.repairs.length) {
  208 |       for (const id of fixture.repairs) {
  209 |         await fixture.db.query('DELETE FROM repair_tickets WHERE id=$1', [id]);
  210 |       }
  211 |     }
  212 | 
  213 |     // Clean up payments and orders
  214 |     if (fixture.users.length) {
  215 |       await fixture.db.query(
  216 |         'DELETE FROM payments WHERE "customerId" = ANY($1::uuid[])',
  217 |         [fixture.users],
  218 |       );
  219 |       await fixture.db.query(
  220 |         'DELETE FROM orders WHERE "customerId" = ANY($1::uuid[])',
  221 |         [fixture.users],
  222 |       );
  223 |       // Clean up repair tickets by customer
  224 |       await fixture.db.query(
  225 |         'DELETE FROM repair_tickets WHERE "customerId" = ANY($1::uuid[])',
  226 |         [fixture.users],
  227 |       );
  228 |     }
  229 | 
  230 |     // Clean up users
  231 |     for (const id of fixture.users) {
  232 |       await fixture.db.query('DELETE FROM users WHERE id=$1', [id]);
  233 |     }
  234 | 
  235 |     // Clean up products
  236 |     for (const id of fixture.products) {
  237 |       await fixture.db.query('DELETE FROM products WHERE "productID"=$1', [id]);
  238 |     }
  239 | 
```