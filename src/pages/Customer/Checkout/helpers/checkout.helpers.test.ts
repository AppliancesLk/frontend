/**
 * @file checkout.helpers.test.ts
 * @description Tests for checkout helper functions (form validation, data normalization)
 *
 * Test Case IDs:
 * - TC-FE-CHECKOUT-001: initialDelivery should create draft with email prefilled
 * - TC-FE-CHECKOUT-002: normalizeDelivery should trim whitespace from all fields
 * - TC-FE-CHECKOUT-003: normalizeDelivery should exclude empty addressLine2
 * - TC-FE-CHECKOUT-004: validateDelivery should return errors for empty required fields
 * - TC-FE-CHECKOUT-005: validateDelivery should validate email format
 * - TC-FE-CHECKOUT-006: validateDelivery should validate phone format (Sri Lankan)
 * - TC-FE-CHECKOUT-007: validateDelivery should validate postal code format
 * - TC-FE-CHECKOUT-008: validateDelivery should return empty object for valid data
 * - TC-FE-CHECKOUT-009: checkoutChanges should detect price changes
 * - TC-FE-CHECKOUT-010: checkoutChanges should detect item quantity changes
 */

import { describe, it, expect } from 'vitest';
import {
  initialDelivery,
  normalizeDelivery,
  validateDelivery,
  checkoutChanges,
} from './checkout.helpers';
import type { DeliveryDraft } from '../types/checkout.types';
import { createMockCart, createMockCartItem } from '../../../../test/factories';
import type { CheckoutSummary } from '../../../../types/checkout.types';

describe('checkout.helpers', () => {
  describe('initialDelivery', () => {
    // TC-FE-CHECKOUT-001
    it('should create draft with email prefilled', () => {
      // Arrange
      const email = 'user@example.com';

      // Act
      const result = initialDelivery(email);

      // Assert
      expect(result.email).toBe(email);
      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
      expect(result.phone).toBe('');
      expect(result.addressLine1).toBe('');
      expect(result.addressLine2).toBe('');
      expect(result.city).toBe('');
      expect(result.postalCode).toBe('');
      expect(result.countryCode).toBe('LK');
    });
  });

  describe('normalizeDelivery', () => {
    // TC-FE-CHECKOUT-002
    it('should trim whitespace from all fields', () => {
      // Arrange
      const draft: DeliveryDraft = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john@example.com  ',
        phone: '  0771234567  ',
        addressLine1: '  123 Main St  ',
        addressLine2: '  Apt 4  ',
        city: '  Colombo  ',
        postalCode: '  00100  ',
        countryCode: '  lk  ',
      };

      // Act
      const result = normalizeDelivery(draft);

      // Assert
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.phone).toBe('0771234567');
      expect(result.addressLine1).toBe('123 Main St');
      expect(result.addressLine2).toBe('Apt 4');
      expect(result.city).toBe('Colombo');
      expect(result.postalCode).toBe('00100');
      expect(result.countryCode).toBe('LK'); // Should be uppercase
    });

    // TC-FE-CHECKOUT-003
    it('should exclude empty addressLine2', () => {
      // Arrange
      const draft: DeliveryDraft = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0771234567',
        addressLine1: '123 Main St',
        addressLine2: '   ', // Only whitespace
        city: 'Colombo',
        postalCode: '00100',
        countryCode: 'LK',
      };

      // Act
      const result = normalizeDelivery(draft);

      // Assert
      expect(result).not.toHaveProperty('addressLine2');
    });
  });

  describe('validateDelivery', () => {
    const validDraft: DeliveryDraft = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '0771234567',
      addressLine1: '123 Main St',
      addressLine2: '',
      city: 'Colombo',
      postalCode: '00100',
      countryCode: 'LK',
    };

    // TC-FE-CHECKOUT-004
    it('should return errors for empty required fields', () => {
      // Arrange
      const draft: DeliveryDraft = {
        firstName: '',
        lastName: '',
        email: 'valid@email.com',
        phone: '0771234567',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '00100',
        countryCode: 'LK',
      };

      // Act
      const errors = validateDelivery(draft);

      // Assert
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.addressLine1).toBeDefined();
      expect(errors.city).toBeDefined();
    });

    // TC-FE-CHECKOUT-005
    it('should validate email format', () => {
      // Arrange
      const invalidEmails = [
        'notanemail',
        '@nodomain.com',
        'no@.com',
        'spaces in@email.com',
        '',
      ];

      // Act & Assert
      for (const email of invalidEmails) {
        const draft: DeliveryDraft = { ...validDraft, email };
        const errors = validateDelivery(draft);
        expect(errors.email).toBeDefined();
      }
    });

    it('should accept valid email formats', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@example.co.uk',
      ];

      // Act & Assert
      for (const email of validEmails) {
        const draft: DeliveryDraft = { ...validDraft, email };
        const errors = validateDelivery(draft);
        expect(errors.email).toBeUndefined();
      }
    });

    // TC-FE-CHECKOUT-006
    it('should validate Sri Lankan phone format', () => {
      // Arrange - invalid phones
      const invalidPhones = [
        '123456789', // Too short, no prefix
        'abcdefghij', // Letters
        '123', // Way too short
      ];

      // Act & Assert
      for (const phone of invalidPhones) {
        const draft: DeliveryDraft = { ...validDraft, phone };
        const errors = validateDelivery(draft);
        expect(errors.phone).toBeDefined();
      }
    });

    it('should accept valid Sri Lankan phone formats', () => {
      // Arrange - valid phones (0 + 1-9 + 8 digits)
      const validPhones = [
        '0771234567',
        '0112345678',
        '+94771234567',
      ];

      // Act & Assert
      for (const phone of validPhones) {
        const draft: DeliveryDraft = { ...validDraft, phone };
        const errors = validateDelivery(draft);
        expect(errors.phone).toBeUndefined();
      }
    });

    // TC-FE-CHECKOUT-007
    it('should validate postal code format', () => {
      // Arrange
      const invalidPostalCodes = [
        '', // Empty
        '!@#$%', // Special chars only
        'a', // Too short
      ];

      // Act & Assert
      for (const postalCode of invalidPostalCodes) {
        const draft: DeliveryDraft = { ...validDraft, postalCode };
        const errors = validateDelivery(draft);
        expect(errors.postalCode).toBeDefined();
      }
    });

    it('should accept valid postal code formats', () => {
      // Arrange
      const validPostalCodes = ['00100', '10000', '80000', '12345'];

      // Act & Assert
      for (const postalCode of validPostalCodes) {
        const draft: DeliveryDraft = { ...validDraft, postalCode };
        const errors = validateDelivery(draft);
        expect(errors.postalCode).toBeUndefined();
      }
    });

    // TC-FE-CHECKOUT-008
    it('should return empty object for valid data', () => {
      // Arrange & Act
      const errors = validateDelivery(validDraft);

      // Assert
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should validate field length limits', () => {
      // Arrange
      const longString = 'a'.repeat(250);
      const draft: DeliveryDraft = {
        ...validDraft,
        firstName: longString, // Max 80
        addressLine1: longString, // Max 200
      };

      // Act
      const errors = validateDelivery(draft);

      // Assert
      expect(errors.firstName).toBeDefined();
      expect(errors.addressLine1).toBeDefined();
    });

    it('should validate country code format', () => {
      // Arrange
      // Note: 'lk' is valid because normalizeDelivery converts to uppercase
      // Only truly invalid codes: single char, 3+ chars, or numbers
      const invalidCodes = ['L', 'LKR', '12', 'ABC', '1', ''];

      // Act & Assert
      for (const countryCode of invalidCodes) {
        const draft: DeliveryDraft = { ...validDraft, countryCode };
        const errors = validateDelivery(draft);
        expect(errors.countryCode).toBeDefined();
      }
    });
  });

  describe('checkoutChanges', () => {
    // TC-FE-CHECKOUT-009
    it('should detect price changes', () => {
      // Arrange
      const cartItem = createMockCartItem({
        productId: 'prod-1',
        unitPrice: '100.00',
        quantity: 1,
      });
      const cart = createMockCart([cartItem]);

      const summary: CheckoutSummary = {
        cartId: cart.id!,
        customerId: 'customer-1',
        preparedAt: new Date().toISOString(),
        currency: 'LKR',
        items: [
          {
            cartItemId: cartItem.id,
            productId: 'prod-1',
            name: cartItem.name,
            SKU: cartItem.SKU,
            quantity: 1,
            unitPrice: '120.00', // Price changed
            lineTotal: '120.00',
          },
        ],
        itemCount: 1,
        subtotal: '120.00',
        total: '120.00',
        delivery: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0771234567',
          addressLine1: '123 Test St',
          city: 'Colombo',
          postalCode: '00100',
          countryCode: 'LK',
        },
      };

      // Act
      const result = checkoutChanges(cart, summary);

      // Assert
      expect(result.pricesChanged).toBe(true);
    });

    // TC-FE-CHECKOUT-010
    it('should detect item quantity changes', () => {
      // Arrange
      const cartItem = createMockCartItem({
        productId: 'prod-1',
        unitPrice: '100.00',
        quantity: 2,
      });
      const cart = createMockCart([cartItem]);

      const summary: CheckoutSummary = {
        cartId: cart.id!,
        customerId: 'customer-1',
        preparedAt: new Date().toISOString(),
        currency: 'LKR',
        items: [
          {
            cartItemId: cartItem.id,
            productId: 'prod-1',
            name: cartItem.name,
            SKU: cartItem.SKU,
            quantity: 1, // Quantity changed from 2 to 1
            unitPrice: '100.00',
            lineTotal: '100.00',
          },
        ],
        itemCount: 1,
        subtotal: '100.00',
        total: '100.00',
        delivery: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0771234567',
          addressLine1: '123 Test St',
          city: 'Colombo',
          postalCode: '00100',
          countryCode: 'LK',
        },
      };

      // Act
      const result = checkoutChanges(cart, summary);

      // Assert
      expect(result.itemsChanged).toBe(true);
    });

    it('should detect when items are removed', () => {
      // Arrange
      const cart = createMockCart([
        createMockCartItem({ productId: 'prod-1' }),
        createMockCartItem({ productId: 'prod-2' }),
      ]);

      const summary: CheckoutSummary = {
        cartId: cart.id!,
        customerId: 'customer-1',
        preparedAt: new Date().toISOString(),
        currency: 'LKR',
        items: [
          {
            cartItemId: 'item-1',
            productId: 'prod-1',
            name: 'Product 1',
            SKU: 'SKU-1',
            quantity: 1,
            unitPrice: '100.00',
            lineTotal: '100.00',
          },
          // prod-2 is missing
        ],
        itemCount: 1,
        subtotal: '100.00',
        total: '100.00',
        delivery: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0771234567',
          addressLine1: '123 Test St',
          city: 'Colombo',
          postalCode: '00100',
          countryCode: 'LK',
        },
      };

      // Act
      const result = checkoutChanges(cart, summary);

      // Assert
      expect(result.itemsChanged).toBe(true);
    });

    it('should return no changes for matching cart and summary', () => {
      // Arrange
      const cartItem = createMockCartItem({
        productId: 'prod-1',
        unitPrice: '100.00',
        quantity: 1,
      });
      const cart = createMockCart([cartItem]);

      const summary: CheckoutSummary = {
        cartId: cart.id!,
        customerId: 'customer-1',
        preparedAt: new Date().toISOString(),
        currency: 'LKR',
        items: [
          {
            cartItemId: cartItem.id,
            productId: 'prod-1',
            name: cartItem.name,
            SKU: cartItem.SKU,
            quantity: 1,
            unitPrice: '100.00',
            lineTotal: '100.00',
          },
        ],
        itemCount: 1,
        subtotal: '100.00',
        total: '100.00',
        delivery: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0771234567',
          addressLine1: '123 Test St',
          city: 'Colombo',
          postalCode: '00100',
          countryCode: 'LK',
        },
      };

      // Act
      const result = checkoutChanges(cart, summary);

      // Assert
      expect(result.pricesChanged).toBe(false);
      expect(result.itemsChanged).toBe(false);
    });
  });
});
