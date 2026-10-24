import type { Cart, CartItem } from '../../types/cart.types';

let cartItemCounter = 0;

/**
 * Create a mock cart item.
 */
export function createMockCartItem(
  overrides: Partial<CartItem> = {},
): CartItem {
  cartItemCounter++;
  return {
    id: `cart-item-${cartItemCounter}`,
    productId: `prod-${cartItemCounter}`,
    name: `Test Product ${cartItemCounter}`,
    SKU: `SKU-${cartItemCounter}`,
    images: [`https://example.com/image${cartItemCounter}.jpg`],
    quantity: 1,
    stockQty: 10,
    isAvailable: true,
    unitPrice: '9999.99',
    lineTotal: '9999.99',
    ...overrides,
  };
}

/**
 * Create a mock cart.
 */
export function createMockCart(
  items: CartItem[] = [],
  overrides: Partial<Cart> = {},
): Cart {
  const subtotal = items
    .reduce((sum, item) => sum + parseFloat(item.lineTotal), 0)
    .toFixed(2);

  return {
    id: 'cart-1',
    currency: 'LKR',
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    ...overrides,
  };
}

/**
 * Create an empty cart.
 */
export function createMockEmptyCart(): Cart {
  return createMockCart([], { id: null, itemCount: 0, subtotal: '0.00' });
}

/**
 * Create a cart with a specified number of items.
 */
export function createMockCartWithItems(itemCount: number): Cart {
  const items = Array.from({ length: itemCount }, () => createMockCartItem());
  return createMockCart(items);
}

/**
 * Create a cart item that's out of stock.
 */
export function createMockUnavailableCartItem(
  overrides: Partial<CartItem> = {},
): CartItem {
  return createMockCartItem({
    stockQty: 0,
    isAvailable: false,
    ...overrides,
  });
}

/**
 * Reset the cart item counter (for test isolation).
 */
export function resetCartFactory(): void {
  cartItemCounter = 0;
}
