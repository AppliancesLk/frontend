import type { Order, OrderItem, OrderStatus, AdminOrder } from '../../types/order.types';
import type { DeliveryInformation } from '../../types/checkout.types';

let orderCounter = 0;
let orderItemCounter = 0;

/**
 * Create a mock delivery information.
 */
export function createMockDelivery(
  overrides: Partial<DeliveryInformation> = {},
): DeliveryInformation {
  return {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'test@example.com',
    phone: '0771234567',
    addressLine1: '123 Test Road',
    city: 'Colombo',
    postalCode: '00100',
    countryCode: 'LK',
    ...overrides,
  };
}

/**
 * Create a mock order item.
 */
export function createMockOrderItem(
  overrides: Partial<OrderItem> = {},
): OrderItem {
  orderItemCounter++;
  return {
    id: `order-item-${orderItemCounter}`,
    productId: `prod-${orderItemCounter}`,
    name: `Test Product ${orderItemCounter}`,
    SKU: `SKU-${orderItemCounter}`,
    images: [`https://example.com/image${orderItemCounter}.jpg`],
    quantity: 1,
    unitPrice: '9999.99',
    lineTotal: '9999.99',
    ...overrides,
  };
}

/**
 * Create a mock order.
 */
export function createMockOrder(overrides: Partial<Order> = {}): Order {
  orderCounter++;
  const now = new Date().toISOString();
  return {
    id: `order-${orderCounter}`,
    customerId: 'customer-1',
    sourceCartId: `cart-${orderCounter}`,
    status: 'CONFIRMED' as OrderStatus,
    currency: 'LKR',
    delivery: createMockDelivery(),
    subtotal: '9999.99',
    total: '9999.99',
    paymentMethod: 'PAYHERE',
    loyaltyRedeemed: '0.00',
    loyaltyEarned: '99.99',
    history: [
      { id: `history-${orderCounter}`, status: 'CONFIRMED', createdAt: now },
    ],
    preparedAt: now,
    createdAt: now,
    updatedAt: now,
    items: [createMockOrderItem()],
    ...overrides,
  };
}

/**
 * Create a mock admin order (with customer info).
 */
export function createMockAdminOrder(
  overrides: Partial<AdminOrder> = {},
): AdminOrder {
  const order = createMockOrder();
  return {
    ...order,
    customer: {
      id: 'customer-1',
      username: 'testcustomer',
      email: 'customer@example.com',
    },
    payment: {
      id: 'payment-1',
      status: 'SUCCESS',
      method: 'PAYHERE',
      amount: '9999.99',
      currency: 'LKR',
      updatedAt: new Date().toISOString(),
    },
    ...overrides,
  };
}

/**
 * Create multiple mock orders.
 */
export function createMockOrders(
  count: number,
  overrides: Partial<Order> = {},
): Order[] {
  return Array.from({ length: count }, () => createMockOrder(overrides));
}

/**
 * Create an order with a specific status.
 */
export function createMockOrderWithStatus(status: OrderStatus): Order {
  return createMockOrder({ status });
}

/**
 * Reset the order counters (for test isolation).
 */
export function resetOrderFactory(): void {
  orderCounter = 0;
  orderItemCounter = 0;
}
