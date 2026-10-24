/**
 * @file cart.helpers.test.ts
 * @description Tests for cart helper functions
 *
 * Test Case IDs:
 * - TC-FE-CART-001: canChangeQuantity should return true for available items with stock
 * - TC-FE-CART-002: canChangeQuantity should return false for out of stock items
 * - TC-FE-CART-003: canChangeQuantity should return true when quantity exceeds stock (to allow decrease)
 * - TC-FE-CART-004: nextQuantity should return decremented value for valid decrease
 * - TC-FE-CART-005: nextQuantity should return incremented value for valid increase
 * - TC-FE-CART-006: nextQuantity should return null when quantity would exceed stock
 * - TC-FE-CART-007: nextQuantity should return null when quantity would be zero
 * - TC-FE-CART-008: nextQuantity should cap to stock when decreasing overstocked item
 */

import { describe, it, expect } from 'vitest';
import { canChangeQuantity, nextQuantity } from './cart.helpers';
import { createMockCartItem } from '../../../../test/factories';

describe('cart.helpers', () => {
  describe('canChangeQuantity', () => {
    // TC-FE-CART-001
    it('should return true for available items with stock', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 10,
        isAvailable: true,
        quantity: 2,
      });

      // Act
      const result = canChangeQuantity(item);

      // Assert
      expect(result).toBe(true);
    });

    // TC-FE-CART-002
    it('should return false for out of stock items', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 0,
        isAvailable: false,
        quantity: 1,
      });

      // Act
      const result = canChangeQuantity(item);

      // Assert
      expect(result).toBe(false);
    });

    // TC-FE-CART-003
    it('should return true when quantity exceeds stock (to allow decrease)', () => {
      // Arrange - item has more in cart than available stock
      const item = createMockCartItem({
        stockQty: 2,
        isAvailable: false, // Marked unavailable because quantity > stock
        quantity: 5,
      });

      // Act
      const result = canChangeQuantity(item);

      // Assert - should allow changes to reduce quantity
      expect(result).toBe(true);
    });

    it('should return false when stock is zero regardless of availability', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 0,
        isAvailable: true, // Edge case
        quantity: 1,
      });

      // Act
      const result = canChangeQuantity(item);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('nextQuantity', () => {
    // TC-FE-CART-004
    it('should return decremented value for valid decrease', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 10,
        isAvailable: true,
        quantity: 5,
      });

      // Act
      const result = nextQuantity(item, -1);

      // Assert
      expect(result).toBe(4);
    });

    // TC-FE-CART-005
    it('should return incremented value for valid increase', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 10,
        isAvailable: true,
        quantity: 5,
      });

      // Act
      const result = nextQuantity(item, 1);

      // Assert
      expect(result).toBe(6);
    });

    // TC-FE-CART-006
    it('should return null when quantity would exceed stock', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 5,
        isAvailable: true,
        quantity: 5, // Already at max
      });

      // Act
      const result = nextQuantity(item, 1);

      // Assert
      expect(result).toBeNull();
    });

    // TC-FE-CART-007
    it('should return null when quantity would be zero', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 10,
        isAvailable: true,
        quantity: 1, // Already at minimum
      });

      // Act
      const result = nextQuantity(item, -1);

      // Assert
      expect(result).toBeNull();
    });

    // TC-FE-CART-008
    it('should cap to stock when decreasing overstocked item', () => {
      // Arrange - user has 10 in cart but only 3 in stock
      const item = createMockCartItem({
        stockQty: 3,
        isAvailable: false,
        quantity: 10,
      });

      // Act - decrease should cap to stock level
      const result = nextQuantity(item, -1);

      // Assert
      expect(result).toBe(3);
    });

    it('should return null for items that cannot change quantity', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 0,
        isAvailable: false,
        quantity: 1,
      });

      // Act
      const resultIncrease = nextQuantity(item, 1);
      const resultDecrease = nextQuantity(item, -1);

      // Assert
      expect(resultIncrease).toBeNull();
      expect(resultDecrease).toBeNull();
    });

    it('should handle edge case of quantity at stock level', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 3,
        isAvailable: true,
        quantity: 3,
      });

      // Act
      const resultIncrease = nextQuantity(item, 1);
      const resultDecrease = nextQuantity(item, -1);

      // Assert
      expect(resultIncrease).toBeNull(); // Cannot increase beyond stock
      expect(resultDecrease).toBe(2); // Can decrease
    });

    it('should handle large stock quantities correctly', () => {
      // Arrange
      const item = createMockCartItem({
        stockQty: 1000000,
        isAvailable: true,
        quantity: 500000,
      });

      // Act
      const resultIncrease = nextQuantity(item, 1);
      const resultDecrease = nextQuantity(item, -1);

      // Assert
      expect(resultIncrease).toBe(500001);
      expect(resultDecrease).toBe(499999);
    });
  });
});
