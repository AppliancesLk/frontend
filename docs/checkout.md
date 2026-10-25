# Customer checkout and PayHere

The authenticated `/checkout` route validates delivery and cart data with
`POST /checkout/prepare`. The page displays only totals returned by the backend.

After validation, **Pay with PayHere** follows this flow:

1. `POST /orders` creates the order with a stable idempotency key.
2. `POST /payments/initiate` sends only the order ID. The backend loads the trusted
   amount and returns signed PayHere sandbox fields.
3. The page loads PayHere's official JavaScript SDK and passes those fields to
   `payhere.startPayment` unchanged.
4. Completed, dismissed, and error browser callbacks all trigger an authenticated
   `GET /payments/orders/:orderId` check.
5. Only backend status `SUCCESS` navigates to `/orders/:orderId`. Failed and
   cancelled results can be retried; pending verification can be checked again.

The browser callback never marks an order as paid. PayHere must call the backend
notification URL, where the signature, merchant, amount, currency, and order are
verified. Checkout locks delivery after order creation and prevents another
submission while the gateway or verification is active.

Run:

```text
npm run build
npm run lint
npm run test:checkout
npm run test:checkout:e2e
```

The end-to-end server uses sandbox-only test credentials. A manual PayHere sandbox
payment also requires a configured sandbox merchant secret and a publicly reachable
backend notification URL.
