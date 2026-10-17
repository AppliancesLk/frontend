# Customer shopping cart

The customer Cart page lives in `src/pages/Customer/Cart`. Its components,
quantity rules, and async hook remain local to that page. API contracts live in
`src/types/cart.types.ts`; all requests go through `cartService` and the existing
cookie-enabled `apiClient`. No cart data or authentication credentials are
stored in browser storage.

## Customer flow

1. Sign in as a CUSTOMER.
2. Open a product detail page and choose **Add to cart** (adds one unit).
3. Use **View cart**, or **Cart** in the customer navigation.
4. Increase/decrease quantity, remove a product, or confirm **Clear cart**.

Guests are sent to the existing sign-in flow with their destination preserved.
Staff roles cannot access the customer Cart route or add-to-cart action.

The page displays names, images/fallbacks, SKU, quantity, unit prices, line totals,
and subtotal from backend responses. It never computes order totals locally.
Fixed-decimal backend values retain precision in the shared currency formatter.
Quantity controls prevent zero, negative values, and requests above known stock.
If stock falls below the current quantity, decreasing sets a valid quantity at
the new available stock. Backend validation remains authoritative.

Mutations are serialized and all cart edit controls are disabled while a request
is pending. Successful responses replace the displayed cart. Failures retain a
clear error message and re-read the cart to reconcile changed stock, missing
items, or an uncertain network result. Mutations are never silently repeated.
Initial/retry loads, empty carts, unavailable products, and operation progress
have explicit UI states. The existing authentication interceptor handles expired
sessions. No checkout or order creation is included.

`ProductImage` is now a shared component because both Product Details and Cart
use its image fallback behavior.

## Checks

```sh
npm run build
npm run lint
npm run test:cart
npm run test:auth
npm run test:products
npm run test:product-edit
```

Browser coverage uses Playwright against the real frontend, backend, and
configured development PostgreSQL database:

```sh
npm --prefix ../backend run build
npx playwright install chromium
npm run test:cart:e2e
```

Apply the backend Cart migration before running these tests. Playwright starts
isolated instances on `http://localhost:3001` and `http://localhost:5174`, then
stops them afterward. Your existing development servers remain available.
Fresh instances preserve the real authentication rate limiter while preventing
repeated test runs from exhausting the development server's login allowance.
`CART_FRONTEND_URL`, `CART_BACKEND_URL`, and `CART_BACKEND_DIR` can override
these defaults; the test ports must be free. The backend defaults to the sibling
`../backend` repository. Its PostgreSQL client and environment configuration are
used for fixture administration; an existing migrated development database is
required.

Tests provision unique temporary accounts/products/categories, promote only the
temporary admin through the database, and clean up only those fixtures. Cart
interactions use the real API and real browser cookie login. Network failure
cases intentionally abort requests; delayed requests continue to the real API.

The suite runs at desktop (1440px) and mobile (390px) widths. It covers login
redirects, adding/repeated products, quantity bounds, exact subtotal updates,
removal, clear/cancel, reload persistence, empty/loading/saving states, stock
errors, API failures/retry, role restrictions, horizontal overflow, and browser
runtime errors. Populated-cart screenshots are saved under ignored `test-results`.
