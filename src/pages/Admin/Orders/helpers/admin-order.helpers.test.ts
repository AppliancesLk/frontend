/**
 * @file admin-order.helpers.test.ts
 * @description Tests for admin order helper functions (order status transitions)
 *
 * Test Case IDs:
 * - TC-FE-ADMIN-001: nextOrderStatuses should return CANCELLED for PENDING_PAYMENT
 * - TC-FE-ADMIN-002: nextOrderStatuses should return PROCESSING and CANCELLED for CONFIRMED
 * - TC-FE-ADMIN-003: nextOrderStatuses should return SHIPPED and CANCELLED for PROCESSING
 * - TC-FE-ADMIN-004: nextOrderStatuses should return DELIVERED for SHIPPED
 * - TC-FE-ADMIN-005: nextOrderStatuses should return empty array for DELIVERED
 * - TC-FE-ADMIN-006: nextOrderStatuses should return empty array for CANCELLED
 */

import { describe, it, expect } from 'vitest';
import { nextOrderStatuses } from './admin-order.helpers';

describe('admin-order.helpers', () => {
  describe('nextOrderStatuses', () => {
    // TC-FE-ADMIN-001
    it('should return CANCELLED for PENDING_PAYMENT', () => {
      // Arrange & Act
      const result = nextOrderStatuses('PENDING_PAYMENT');

      // Assert
      expect(result).toEqual(['CANCELLED']);
    });

    // TC-FE-ADMIN-002
    it('should return PROCESSING and CANCELLED for CONFIRMED', () => {
      // Arrange & Act
      const result = nextOrderStatuses('CONFIRMED');

      // Assert
      expect(result).toEqual(['PROCESSING', 'CANCELLED']);
      expect(result).toContain('PROCESSING');
      expect(result).toContain('CANCELLED');
    });

    // TC-FE-ADMIN-003
    it('should return SHIPPED and CANCELLED for PROCESSING', () => {
      // Arrange & Act
      const result = nextOrderStatuses('PROCESSING');

      // Assert
      expect(result).toEqual(['SHIPPED', 'CANCELLED']);
      expect(result).toContain('SHIPPED');
      expect(result).toContain('CANCELLED');
    });

    // TC-FE-ADMIN-004
    it('should return DELIVERED for SHIPPED', () => {
      // Arrange & Act
      const result = nextOrderStatuses('SHIPPED');

      // Assert
      expect(result).toEqual(['DELIVERED']);
    });

    // TC-FE-ADMIN-005
    it('should return empty array for DELIVERED (final state)', () => {
      // Arrange & Act
      const result = nextOrderStatuses('DELIVERED');

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    // TC-FE-ADMIN-006
    it('should return empty array for CANCELLED (final state)', () => {
      // Arrange & Act
      const result = nextOrderStatuses('CANCELLED');

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should follow valid order workflow from CONFIRMED to DELIVERED', () => {
      // Test the happy path workflow
      // CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED

      // Start: CONFIRMED
      let nextStates = nextOrderStatuses('CONFIRMED');
      expect(nextStates).toContain('PROCESSING');

      // After payment: PROCESSING
      nextStates = nextOrderStatuses('PROCESSING');
      expect(nextStates).toContain('SHIPPED');

      // After packing: SHIPPED
      nextStates = nextOrderStatuses('SHIPPED');
      expect(nextStates).toContain('DELIVERED');

      // Final: DELIVERED
      nextStates = nextOrderStatuses('DELIVERED');
      expect(nextStates).toHaveLength(0);
    });

    it('should allow cancellation from most states', () => {
      // PENDING_PAYMENT, CONFIRMED, and PROCESSING can be cancelled
      const cancellableStates = [
        'PENDING_PAYMENT',
        'CONFIRMED',
        'PROCESSING',
      ] as const;

      for (const status of cancellableStates) {
        const result = nextOrderStatuses(status);
        expect(result).toContain('CANCELLED');
      }
    });

    it('should not allow cancellation from SHIPPED or DELIVERED', () => {
      // Once shipped, order cannot be cancelled through normal workflow
      const nonCancellableStates = ['SHIPPED', 'DELIVERED'] as const;

      for (const status of nonCancellableStates) {
        const result = nextOrderStatuses(status);
        expect(result).not.toContain('CANCELLED');
      }
    });
  });
});
