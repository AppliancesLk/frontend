/**
 * @file index.test.ts
 * @description Tests for test factory functions to ensure mock data is valid
 *
 * Test Case IDs:
 * - TC-FE-FACTORY-001: User factories should create valid user objects
 * - TC-FE-FACTORY-002: Product factories should create valid product objects
 * - TC-FE-FACTORY-003: Cart factories should create valid cart objects
 * - TC-FE-FACTORY-004: Order factories should create valid order objects
 * - TC-FE-FACTORY-005: Repair factories should create valid repair objects
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMockUser,
  createMockAdmin,
  createMockCustomer,
  createMockRepairer,
  resetUserFactory,
} from './user';
import {
  createMockProduct,
  createMockCategory,
  createMockProducts,
  createMockOutOfStockProduct,
  resetProductFactory,
} from './product';
import {
  createMockCart,
  createMockCartItem,
  createMockEmptyCart,
  createMockCartWithItems,
  resetCartFactory,
} from './cart';
import {
  createMockOrder,
  createMockDelivery,
  createMockOrderItem,
  createMockOrders,
  resetOrderFactory,
} from './order';
import {
  createMockRepairTicket,
  createMockDevice,
  createMockRepairTickets,
  createMockRepairWithStatus,
  resetRepairFactory,
} from './repair';

describe('Test Factories', () => {
  beforeEach(() => {
    // Reset all factory counters for test isolation
    resetUserFactory();
    resetProductFactory();
    resetCartFactory();
    resetOrderFactory();
    resetRepairFactory();
  });

  describe('User Factories', () => {
    // TC-FE-FACTORY-001
    it('should create valid user objects with required fields', () => {
      // Act
      const user = createMockUser();

      // Assert
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(typeof user.id).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(user.email).toMatch(/@/);
    });

    it('should create admin user with ADMIN role', () => {
      // Act
      const admin = createMockAdmin();

      // Assert
      expect(admin.role).toBe('ADMIN');
    });

    it('should create customer user with CUSTOMER role', () => {
      // Act
      const customer = createMockCustomer();

      // Assert
      expect(customer.role).toBe('CUSTOMER');
    });

    it('should create repairer user with REPAIRER role', () => {
      // Act
      const repairer = createMockRepairer();

      // Assert
      expect(repairer.role).toBe('REPAIRER');
    });

    it('should allow overriding user properties', () => {
      // Arrange
      const customUsername = 'custom_user';
      const customEmail = 'custom@test.com';

      // Act
      const user = createMockUser({
        username: customUsername,
        email: customEmail,
      });

      // Assert
      expect(user.username).toBe(customUsername);
      expect(user.email).toBe(customEmail);
    });

    it('should create unique users', () => {
      // Act
      const user1 = createMockUser();
      const user2 = createMockUser();

      // Assert
      expect(user1.id).not.toBe(user2.id);
      expect(user1.username).not.toBe(user2.username);
    });
  });

  describe('Product Factories', () => {
    // TC-FE-FACTORY-002
    it('should create valid product objects with required fields', () => {
      // Act
      const product = createMockProduct();

      // Assert
      expect(product).toHaveProperty('productID');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('SKU');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stockQty');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('isActive');
      expect(typeof product.stockQty).toBe('number');
    });

    it('should create valid category objects', () => {
      // Act
      const category = createMockCategory();

      // Assert
      expect(category).toHaveProperty('categoryID');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('isActive');
    });

    it('should create multiple products', () => {
      // Act
      const products = createMockProducts(5);

      // Assert
      expect(products).toHaveLength(5);
      for (const product of products) {
        expect(product).toHaveProperty('productID');
      }
    });

    it('should create out of stock product', () => {
      // Act
      const product = createMockOutOfStockProduct();

      // Assert
      expect(product.stockQty).toBe(0);
    });

    it('should allow overriding product properties', () => {
      // Arrange
      const customName = 'Custom Product';
      const customPrice = '199.99';

      // Act
      const product = createMockProduct({
        name: customName,
        price: customPrice,
      });

      // Assert
      expect(product.name).toBe(customName);
      expect(product.price).toBe(customPrice);
    });
  });

  describe('Cart Factories', () => {
    // TC-FE-FACTORY-003
    it('should create valid cart item objects', () => {
      // Act
      const item = createMockCartItem();

      // Assert
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('productId');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('unitPrice');
      expect(item).toHaveProperty('lineTotal');
      expect(item).toHaveProperty('stockQty');
      expect(item).toHaveProperty('isAvailable');
    });

    it('should create valid cart objects', () => {
      // Arrange
      const items = [createMockCartItem(), createMockCartItem()];

      // Act
      const cart = createMockCart(items);

      // Assert
      expect(cart).toHaveProperty('id');
      expect(cart).toHaveProperty('items');
      expect(cart).toHaveProperty('itemCount');
      expect(cart).toHaveProperty('subtotal');
      expect(cart.items).toHaveLength(2);
    });

    it('should create empty cart', () => {
      // Act
      const cart = createMockEmptyCart();

      // Assert
      expect(cart.items).toHaveLength(0);
      expect(cart.itemCount).toBe(0);
      expect(cart.subtotal).toBe('0.00');
    });

    it('should create cart with specified number of items', () => {
      // Act
      const cart = createMockCartWithItems(3);

      // Assert
      expect(cart.items).toHaveLength(3);
      expect(cart.itemCount).toBeGreaterThanOrEqual(3);
    });

    it('should calculate cart subtotal correctly', () => {
      // Arrange
      const item1 = createMockCartItem({ lineTotal: '100.00' });
      const item2 = createMockCartItem({ lineTotal: '50.00' });

      // Act
      const cart = createMockCart([item1, item2]);

      // Assert
      expect(cart.subtotal).toBe('150.00');
    });
  });

  describe('Order Factories', () => {
    // TC-FE-FACTORY-004
    it('should create valid order objects', () => {
      // Act
      const order = createMockOrder();

      // Assert
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('customerId');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('delivery');
      expect(order).toHaveProperty('paymentMethod');
    });

    it('should create valid delivery information', () => {
      // Act
      const delivery = createMockDelivery();

      // Assert
      expect(delivery).toHaveProperty('firstName');
      expect(delivery).toHaveProperty('lastName');
      expect(delivery).toHaveProperty('email');
      expect(delivery).toHaveProperty('phone');
      expect(delivery).toHaveProperty('addressLine1');
      expect(delivery).toHaveProperty('city');
      expect(delivery).toHaveProperty('postalCode');
      expect(delivery).toHaveProperty('countryCode');
    });

    it('should create valid order items', () => {
      // Act
      const item = createMockOrderItem();

      // Assert
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('productId');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('unitPrice');
      expect(item).toHaveProperty('lineTotal');
    });

    it('should create multiple orders', () => {
      // Act
      const orders = createMockOrders(3);

      // Assert
      expect(orders).toHaveLength(3);
      for (const order of orders) {
        expect(order).toHaveProperty('id');
      }
    });

    it('should allow overriding order properties', () => {
      // Act
      const order = createMockOrder({ status: 'SHIPPED' });

      // Assert
      expect(order.status).toBe('SHIPPED');
    });
  });

  describe('Repair Factories', () => {
    // TC-FE-FACTORY-005
    it('should create valid repair ticket objects', () => {
      // Act
      const ticket = createMockRepairTicket();

      // Assert
      expect(ticket).toHaveProperty('id');
      expect(ticket).toHaveProperty('reference');
      expect(ticket).toHaveProperty('customerId');
      expect(ticket).toHaveProperty('device');
      expect(ticket).toHaveProperty('problemDescription');
      expect(ticket).toHaveProperty('status');
    });

    it('should create valid device information', () => {
      // Act
      const device = createMockDevice();

      // Assert
      expect(device).toHaveProperty('deviceType');
      expect(device).toHaveProperty('brand');
      expect(device).toHaveProperty('model');
    });

    it('should create multiple repair tickets', () => {
      // Act
      const tickets = createMockRepairTickets(4);

      // Assert
      expect(tickets).toHaveLength(4);
      for (const ticket of tickets) {
        expect(ticket).toHaveProperty('id');
        expect(ticket).toHaveProperty('reference');
      }
    });

    it('should create repair with specific status', () => {
      // Act
      const ticket = createMockRepairWithStatus('IN_PROGRESS');

      // Assert
      expect(ticket.status).toBe('IN_PROGRESS');
    });

    it('should generate unique reference numbers', () => {
      // Act
      const ticket1 = createMockRepairTicket();
      const ticket2 = createMockRepairTicket();

      // Assert
      expect(ticket1.reference).not.toBe(ticket2.reference);
    });
  });
});
