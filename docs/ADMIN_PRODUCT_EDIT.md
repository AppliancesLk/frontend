# Admin product editor

Open Admin > Products > Edit, or visit `/admin/products/:id/edit` directly. The route uses the existing ADMIN guard and admin layout. React Router now uses its data-router provider with the same existing route paths, enabling supported navigation blocking.

## Backend contract

- Load through `GET /products/admin/:id`, including inactive products and products in inactive categories.
- Load all category choices through `GET /categories/admin/all`.
- Save through the existing `PATCH /products/:id` service using cookie credentials and the shared CSRF header.
- Send only changed fields. Inventory quantities are never included; use the Inventory link to manage stock.
- Empty image URLs send `images: []` when replacing existing images.
- Clear specifications sends `specifications: null`; removing all specification rows sends an empty object. Untouched null and empty objects retain their original representation.

## Form behavior

Product creation and editing reuse the same name/SKU/price/category/image controls and common validation. The editor adds activation and typed specification controls. Text, numbers, booleans, lists, groups and null values retain their types. Editing one value preserves all other specification values. Very deeply nested existing values remain intact and are shown as preserved values rather than flattened or silently converted.

Saving keeps the editor open, displays confirmation, and uses the full returned product as the new baseline. Failed saves retain the draft and display a friendly error. Missing records and load failures have dedicated states; forbidden requests have an access-denied state.

Cancel, sidebar links, and browser Back trigger a native modal when there are unsaved changes. Reload and tab close use the browser's standard beforeunload warning. Navigation during a pending save waits for completion or lets the user continue editing; discard is disabled while saving.

Unsaved drafts are retained only in memory for the current tab, keyed by account ID and product ID. This allows an expired-session redirect and re-login to restore the same account's edits without writing product drafts or credentials to localStorage/sessionStorage. Successful saves and confirmed discards clear the cached draft. A full page reload discards it after the browser warning is accepted.

## Verification

- npm run test:product-edit: payload construction, typed specifications, clearing, dirty detection, cache isolation and creation regression tests.
- npm run test:products and npm run test:auth: existing regression tests.
- npm run build and npm run lint.

Development smoke checks also exercised frontend-built edit payloads against the running backend using temporary records, verified public detail updates and clearing behavior, and rendered the actual form components through Vite SSR. Temporary database records were removed afterward. Browser-based visual and interaction testing was unavailable in this environment.
