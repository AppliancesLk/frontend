# Customer Checkout

The customer-only `/checkout` route lives under `src/pages/Customer/Checkout`.
Cart's summary now links to it with **Proceed to checkout**; the link is disabled
while Cart mutations are processing. Existing cookie authentication,
`ProtectedRoute`, CUSTOMER roles, and the shared `apiClient` are reused.

## Customer flow

1. Add products and open Cart.
2. Choose **Proceed to checkout**.
3. Review the products, quantities, unit prices, line totals, and subtotal.
4. Enter delivery details and choose **Prepare checkout**.
5. Review the backend-validated final amount and delivery summary.

Before preparation, the final amount is explicitly marked **Not yet validated**.
The page uses the backend `GET /cart` response for the initial summary and
`POST /checkout/prepare` for validation. It never calculates line totals,
subtotal, or final amount on the frontend. Successful preparation replaces all
summary items and amounts with the backend response and highlights price/cart
changes since the page loaded. There is no PayHere, payment submission, or order
creation action in this ticket.

## Organization and contracts

- `src/services/checkoutService.ts`: typed preparation request through apiClient.
- `src/types/checkout.types.ts`: backend-aligned delivery, request, and response types.
- Checkout-local components, hook, helpers, and form-only types remain in its page folder.
- Shared `cartService`, `formatCurrency`, translations, and ProductImage are reused.
- EmptyCart moved to shared feedback components because Cart and Checkout both use it.

The request contains only `{ delivery: ... }`. It never sends customer/cart IDs,
products, prices, totals, fees, or discounts. The contact email is prefilled from
the current authenticated user but can be changed as a delivery contact. All
required fields are labeled; field errors identify and focus the first invalid
input. The optional second address line is omitted when blank. Phone format
checks cover local Sri Lankan and international shapes; the backend performs
final phone/country and delivery validation. No shipping coverage policy is
introduced by these form checks.

A ref guard and disabled controls prevent overlapping submission. Delivery
changes invalidate the prior preparation result immediately while retaining
the latest backend prices as the unconfirmed summary preview. A failed request
retains delivery entries, clears readiness, and re-reads the current cart without
repeating the submission. Unavailable/understocked items are marked and the
customer is directed back to Cart. Empty/loading/load-error/retry states are
explicit. The shared authentication interceptor handles expired sessions.

Delivery data and validated summaries remain in page memory, scoped to the
current account, and are discarded on unmount/reload. They are not logged or
persisted in browser storage. Preparation is a point-in-time result; the future
backend payment/order flow must revalidate before using any amount.

## Verification

```sh
npm run build
npm run lint
npm run test:checkout
npm run test:cart
npm run test:auth
npm run test:products
npm run test:product-edit
```

Real-backend browser tests reuse the Cart Playwright server configuration and
shared isolated shop fixtures:

```sh
npm --prefix ../backend run build
npx playwright install chromium
npm run test:checkout:e2e
npm run test:cart:e2e
```

The configured PostgreSQL database must have the Cart migration applied.
Playwright starts separate backend/frontend processes on ports 3001/5174 and
stops them afterward, leaving development servers alone. CART_BACKEND_DIR,
CART_BACKEND_URL, and CART_FRONTEND_URL override the inherited test defaults.
Unique test accounts and catalog fixtures are cleaned up after each suite;
tests never remove unrelated data. Delayed requests continue to real APIs;
network-failure cases intentionally abort only selected test requests.

Checkout tests run at desktop (1440px) and mobile (390px) widths and cover Cart
navigation, required/phone validation, delivery-only payloads, trusted totals,
price/quantity changes, stock/unavailable/empty carts, retained entries,
loading/saving/duplicate clicks, retry, cookie expiry, role restrictions,
horizontal overflow, and browser runtime errors. Validated-page screenshots are
saved under ignored `test-results`.
