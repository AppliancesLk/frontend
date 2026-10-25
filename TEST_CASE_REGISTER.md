# Frontend Test Case Register

**Project:** Appliances.lk E-commerce Platform
**Component:** Frontend (React + TypeScript + Vite)
**Testing Framework:** Vitest + React Testing Library
**Last Updated:** 2024

## Test Case Summary

| Category | Test File | Test Cases | Status |
|----------|-----------|------------|--------|
| Authentication | ProtectedRoute.test.tsx | 10 | Ready |
| Authentication | AuthForm.test.tsx | ~20 | Ready |
| UI Components | StatusBadge.test.tsx | 12 | Ready |
| UI Components | Feedback.test.tsx | Existing | Ready |
| UI Components | Dialog.test.tsx | Existing | Ready |
| Cart | cart.helpers.test.ts | 10 | Ready |
| Checkout | checkout.helpers.test.ts | 15 | Ready |
| Orders | OrderStatusBadge.test.tsx | 12 | Ready |
| Orders (Admin) | admin-order.helpers.test.ts | 10 | Ready |
| Repairs | repair-request.helpers.test.ts | 12 | Ready |
| Repairs (Admin) | RepairStatusBadge.test.tsx | 12 | Ready |
| Utilities | currency.test.ts | 15 | Ready |
| Utilities | stockValidation.test.ts | 12 | Ready |
| Utilities | validation.test.ts | 6 | Ready |
| Utilities | apiErrors.test.ts | 12 | Ready |
| Utilities | date.test.ts | 8 | Ready |
| Factories | index.test.ts | 25 | Ready |

---

## Authentication Test Cases

### ProtectedRoute.test.tsx
Located: `src/components/auth/ProtectedRoute.test.tsx`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-AUTH-001 | Should show loading state while checking session | Component |
| TC-FE-AUTH-002 | Should redirect unauthenticated users to login | Integration |
| TC-FE-AUTH-003 | Should display error state with retry option | Component |
| TC-FE-AUTH-004 | Should render children for authenticated users | Component |
| TC-FE-AUTH-005 | Should redirect to forbidden when user lacks required role | Integration |
| TC-FE-AUTH-006 | Should render content for users with correct role | Integration |
| TC-FE-AUTH-007 | Should allow repairer to access repairer routes | Integration |
| TC-FE-AUTH-008 | Should preserve the requested URL in redirect state | Integration |
| TC-FE-AUTH-009 | Should support multiple allowed roles | Integration |
| TC-FE-AUTH-010 | Should allow any authenticated user when no roles specified | Integration |

### AuthForm.test.tsx
Located: `src/pages/Auth/components/AuthForm.test.tsx`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-AUTH-011 | Login form should render required fields | Component |
| TC-FE-AUTH-012 | Login form should validate required fields | Validation |
| TC-FE-AUTH-013 | Login form should call signIn on valid submission | Integration |
| TC-FE-AUTH-014 | Login form should display API errors | Error Handling |
| TC-FE-AUTH-015 | Login form should show loading state during submission | Component |
| TC-FE-AUTH-016 | Register form should render all required fields | Component |
| TC-FE-AUTH-017 | Register form should validate password confirmation | Validation |
| TC-FE-AUTH-018 | Register form should call signUp on valid submission | Integration |
| TC-FE-AUTH-019 | Should toggle password visibility | Component |
| TC-FE-AUTH-020 | Should redirect authenticated users | Integration |

---

## Cart Test Cases

### cart.helpers.test.ts
Located: `src/pages/Customer/Cart/helpers/cart.helpers.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-CART-001 | canChangeQuantity should return true for available items | Unit |
| TC-FE-CART-002 | canChangeQuantity should return false for out of stock | Unit |
| TC-FE-CART-003 | canChangeQuantity should return true when quantity exceeds stock | Unit |
| TC-FE-CART-004 | nextQuantity should return decremented value | Unit |
| TC-FE-CART-005 | nextQuantity should return incremented value | Unit |
| TC-FE-CART-006 | nextQuantity should return null when exceeding stock | Unit |
| TC-FE-CART-007 | nextQuantity should return null when quantity would be zero | Unit |
| TC-FE-CART-008 | nextQuantity should cap to stock when decreasing overstocked | Unit |

---

## Checkout Test Cases

### checkout.helpers.test.ts
Located: `src/pages/Customer/Checkout/helpers/checkout.helpers.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-CHECKOUT-001 | initialDelivery should create draft with email prefilled | Unit |
| TC-FE-CHECKOUT-002 | normalizeDelivery should trim whitespace | Unit |
| TC-FE-CHECKOUT-003 | normalizeDelivery should exclude empty addressLine2 | Unit |
| TC-FE-CHECKOUT-004 | validateDelivery should return errors for empty fields | Validation |
| TC-FE-CHECKOUT-005 | validateDelivery should validate email format | Validation |
| TC-FE-CHECKOUT-006 | validateDelivery should validate phone format | Validation |
| TC-FE-CHECKOUT-007 | validateDelivery should validate postal code | Validation |
| TC-FE-CHECKOUT-008 | validateDelivery should return empty for valid data | Validation |
| TC-FE-CHECKOUT-009 | checkoutChanges should detect price changes | Unit |
| TC-FE-CHECKOUT-010 | checkoutChanges should detect item quantity changes | Unit |

---

## Order Test Cases

### OrderStatusBadge.test.tsx
Located: `src/pages/Customer/Orders/components/OrderStatusBadge.test.tsx`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-ORDER-001 | Should render PENDING_PAYMENT with warning styling | Component |
| TC-FE-ORDER-002 | Should render CONFIRMED with info styling | Component |
| TC-FE-ORDER-003 | Should render PROCESSING with info styling | Component |
| TC-FE-ORDER-004 | Should render SHIPPED with info styling | Component |
| TC-FE-ORDER-005 | Should render DELIVERED with success styling | Component |
| TC-FE-ORDER-006 | Should render CANCELLED with danger styling | Component |

### admin-order.helpers.test.ts
Located: `src/pages/Admin/Orders/helpers/admin-order.helpers.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-ADMIN-001 | nextOrderStatuses returns CANCELLED for PENDING_PAYMENT | Unit |
| TC-FE-ADMIN-002 | nextOrderStatuses returns PROCESSING, CANCELLED for CONFIRMED | Unit |
| TC-FE-ADMIN-003 | nextOrderStatuses returns SHIPPED, CANCELLED for PROCESSING | Unit |
| TC-FE-ADMIN-004 | nextOrderStatuses returns DELIVERED for SHIPPED | Unit |
| TC-FE-ADMIN-005 | nextOrderStatuses returns empty for DELIVERED | Unit |
| TC-FE-ADMIN-006 | nextOrderStatuses returns empty for CANCELLED | Unit |

---

## Repair Test Cases

### repair-request.helpers.test.ts
Located: `src/pages/Customer/Repairs/Request/helpers/repair-request.helpers.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-REPAIR-001 | Should return error for empty device type | Validation |
| TC-FE-REPAIR-002 | Should return error for empty brand | Validation |
| TC-FE-REPAIR-003 | Should return error for empty model | Validation |
| TC-FE-REPAIR-004 | Should return error for short problem description | Validation |
| TC-FE-REPAIR-005 | Should return error for too long fields | Validation |
| TC-FE-REPAIR-006 | Should return error for invalid date format | Validation |
| TC-FE-REPAIR-007 | Should return empty object for valid input | Validation |
| TC-FE-REPAIR-008 | hasErrors should return true when errors exist | Unit |
| TC-FE-REPAIR-009 | hasErrors should return false for empty object | Unit |

### RepairStatusBadge.test.tsx
Located: `src/pages/Admin/Repairs/components/RepairStatusBadge.test.tsx`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-REPAIR-010 | Should render PENDING with warning styling | Component |
| TC-FE-REPAIR-011 | Should render APPROVED with special styling | Component |
| TC-FE-REPAIR-012 | Should render REJECTED with danger styling | Component |
| TC-FE-REPAIR-013 | Should render ASSIGNED with special styling | Component |
| TC-FE-REPAIR-014 | Should render IN_PROGRESS with info styling | Component |
| TC-FE-REPAIR-015 | Should render AWAITING_PARTS with warning styling | Component |
| TC-FE-REPAIR-016 | Should render READY_FOR_COLLECTION with success | Component |
| TC-FE-REPAIR-017 | Should render COMPLETED with success styling | Component |
| TC-FE-REPAIR-018 | Should render CANCELLED with danger styling | Component |

---

## UI Component Test Cases

### StatusBadge.test.tsx
Located: `src/components/ui/StatusBadge.test.tsx`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UI-001 | Should render children content | Component |
| TC-FE-UI-002 | Should apply success tone for success statuses | Component |
| TC-FE-UI-003 | Should apply warning tone for pending statuses | Component |
| TC-FE-UI-004 | Should apply danger tone for error statuses | Component |
| TC-FE-UI-005 | Should apply info tone for processing statuses | Component |
| TC-FE-UI-006 | Should apply neutral tone for unknown statuses | Component |
| TC-FE-UI-007 | Should override status tone with explicit tone prop | Component |
| TC-FE-UI-008 | Should include status indicator dot | Component |

---

## Utility Test Cases

### currency.test.ts
Located: `src/utils/currency.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UTIL-001 | formatCurrency should format string decimals | Unit |
| TC-FE-UTIL-002 | formatCurrency should format number values | Unit |
| TC-FE-UTIL-003 | formatCurrency should handle large values | Unit |
| TC-FE-UTIL-004 | parseMinorUnits should convert decimal to bigint | Unit |
| TC-FE-UTIL-005 | parseMinorUnits should return null for invalid | Unit |
| TC-FE-UTIL-006 | formatMinorUnits should convert bigint to string | Unit |

### stockValidation.test.ts
Located: `src/utils/stockValidation.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UTIL-010 | Should return valid for zero stock | Validation |
| TC-FE-UTIL-011 | Should return valid for positive whole numbers | Validation |
| TC-FE-UTIL-012 | Should return invalid for empty input | Validation |
| TC-FE-UTIL-013 | Should return invalid for negative numbers | Validation |
| TC-FE-UTIL-014 | Should return invalid for decimal numbers | Validation |
| TC-FE-UTIL-015 | Should return invalid for exceeding MAX | Validation |
| TC-FE-UTIL-016 | Should return invalid for non-numeric input | Validation |

### validation.test.ts
Located: `src/utils/validation.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UTIL-020 | isUuid should return true for valid UUIDs | Unit |
| TC-FE-UTIL-021 | isUuid should return false for invalid UUIDs | Unit |
| TC-FE-UTIL-022 | isUuid should return false for undefined | Unit |
| TC-FE-UTIL-023 | isUuid should return false for empty string | Unit |

### apiErrors.test.ts
Located: `src/utils/apiErrors.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UTIL-030 | Should return session expired for 401 | Error Handling |
| TC-FE-UTIL-031 | Should return access denied for 403 | Error Handling |
| TC-FE-UTIL-032 | Should return API message for client errors | Error Handling |
| TC-FE-UTIL-033 | Should join array error messages | Error Handling |
| TC-FE-UTIL-034 | Should return fallback for server errors | Error Handling |
| TC-FE-UTIL-035 | Should return fallback for non-Axios errors | Error Handling |

### date.test.ts
Located: `src/utils/date.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-UTIL-040 | Should format valid ISO date string | Unit |
| TC-FE-UTIL-041 | Should return em-dash for invalid date | Unit |
| TC-FE-UTIL-042 | Should format dates in Sri Lanka timezone | Unit |
| TC-FE-UTIL-043 | Should use uppercase AM/PM | Unit |

---

## Factory Test Cases

### index.test.ts
Located: `src/test/factories/index.test.ts`

| TC ID | Description | Type |
|-------|-------------|------|
| TC-FE-FACTORY-001 | User factories should create valid objects | Unit |
| TC-FE-FACTORY-002 | Product factories should create valid objects | Unit |
| TC-FE-FACTORY-003 | Cart factories should create valid objects | Unit |
| TC-FE-FACTORY-004 | Order factories should create valid objects | Unit |
| TC-FE-FACTORY-005 | Repair factories should create valid objects | Unit |

---

## Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Coverage Targets

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Test Files Structure

```
src/
├── test/
│   ├── setup.ts                    # Global test setup
│   ├── test-utils.tsx              # Testing utilities & providers
│   └── factories/
│       ├── index.test.ts           # Factory tests
│       ├── user.ts                 # User mock factories
│       ├── product.ts              # Product mock factories
│       ├── cart.ts                 # Cart mock factories
│       ├── order.ts                # Order mock factories
│       └── repair.ts               # Repair mock factories
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.test.tsx
│   └── ui/
│       ├── StatusBadge.test.tsx
│       ├── Feedback.test.tsx
│       └── Dialog.test.tsx
├── pages/
│   ├── Auth/
│   │   └── components/
│   │       └── AuthForm.test.tsx
│   ├── Customer/
│   │   ├── Cart/
│   │   │   └── helpers/
│   │   │       └── cart.helpers.test.ts
│   │   ├── Checkout/
│   │   │   └── helpers/
│   │   │       └── checkout.helpers.test.ts
│   │   ├── Orders/
│   │   │   └── components/
│   │   │       └── OrderStatusBadge.test.tsx
│   │   └── Repairs/
│   │       └── Request/
│   │           └── helpers/
│   │               └── repair-request.helpers.test.ts
│   └── Admin/
│       ├── Orders/
│       │   └── helpers/
│       │       └── admin-order.helpers.test.ts
│       └── Repairs/
│           └── components/
│               └── RepairStatusBadge.test.tsx
└── utils/
    ├── currency.test.ts
    ├── stockValidation.test.ts
    ├── validation.test.ts
    ├── apiErrors.test.ts
    └── date.test.ts
```

---

## Appendix: Test Category Mapping

### By User Role
- **ADMIN**: TC-FE-ADMIN-*, TC-FE-AUTH-005, TC-FE-AUTH-006
- **CUSTOMER**: TC-FE-CART-*, TC-FE-CHECKOUT-*, TC-FE-ORDER-*, TC-FE-REPAIR-001-009
- **REPAIRER**: TC-FE-AUTH-007, TC-FE-REPAIR-010-018

### By Feature Area
- **Authentication**: TC-FE-AUTH-*
- **Shopping Cart**: TC-FE-CART-*
- **Checkout**: TC-FE-CHECKOUT-*
- **Orders**: TC-FE-ORDER-*, TC-FE-ADMIN-001-006
- **Repairs**: TC-FE-REPAIR-*
- **UI Components**: TC-FE-UI-*
- **Utilities**: TC-FE-UTIL-*
- **Test Infrastructure**: TC-FE-FACTORY-*

### By Test Type
- **Unit Tests**: TC-FE-UTIL-*, TC-FE-CART-*, TC-FE-FACTORY-*
- **Component Tests**: TC-FE-UI-*, TC-FE-ORDER-*, TC-FE-REPAIR-010-018
- **Integration Tests**: TC-FE-AUTH-002, TC-FE-AUTH-005-010, TC-FE-AUTH-013, TC-FE-AUTH-018, TC-FE-AUTH-020
- **Validation Tests**: TC-FE-CHECKOUT-004-008, TC-FE-REPAIR-001-007, TC-FE-UTIL-010-016
