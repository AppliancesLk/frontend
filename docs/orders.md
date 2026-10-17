# Customer orders

Customer-only routes: `/orders` and `/orders/:id`. My orders appears in the
customer header. Existing ProtectedRoute, authentication context and apiClient
handle role checks, session cookies and session expiration.

The order service reads `GET /orders` and `GET /orders/:id`. The backend scopes
both to the authenticated customer. The list preserves the backend newest-first
ordering. Details render saved item names, quantities, prices, line totals,
delivery information and the canonical backend status. Refresh order reloads
current details and status; no payment or status-update action is introduced.
Money uses the shared exact-decimal currency formatter. Dates use the shared
date formatter in Asia/Colombo. Unknown, unowned and malformed detail IDs show
an order-not-found state. Other failures offer retry. Reads are aborted on
unmount/retry, and account/order changes remount local state.

Page UI and hooks live under `src/pages/Customer/Orders`; reusable API contracts
live in `src/types/order.types.ts`. Existing feedback and image components are
reused, including the missing-image fallback.

## Verification

```sh
npm run build
npm run lint
# Build the backend first; configure its .env for the real PostgreSQL database.
npm run test:orders:e2e
```

Playwright starts isolated frontend/backend processes using the existing shop
fixture helpers. Temporary users, products and orders are cleaned up after tests.
Desktop (1440px) and mobile (390px) coverage includes real list/detail reads,
newest-first ordering, catalog edits preserving purchase snapshots, current status
refresh, direct-link reload, empty history, unknown/unowned/malformed IDs,
authentication/role restrictions, delayed reads, safe errors and retry.
Failure responses are intercepted only for failure-path checks; normal flows use
the real backend and PostgreSQL. Screenshots are written to ignored test-results.

## Admin order management

ADMIN-only routes `/admin/orders` and `/admin/orders/:id` live under the existing
AdminLayout. The list shows customer, date, total, payment state, and order state.
Details show purchase-time items and delivery information, and expose only the
next backend-supported fulfillment transitions. Updates use
`PATCH /admin/orders/:id/status` and replace the displayed order with the server
response. Loading, empty, error, missing-order, failed-update, desktop, and mobile
states follow the shared Tailwind design system.

```sh
npm run test:admin-orders:e2e
```
