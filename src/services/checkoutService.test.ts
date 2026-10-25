/**
 * @file checkoutService.test.ts
 * @description Tests for checkout service API calls
 *
 * Test Case IDs:
 * - TC-FE-CHECKOUT-SVC-001: prepareCheckout calls POST with delivery info
 * - TC-FE-CHECKOUT-SVC-002: prepareCheckout returns checkout summary
 * - TC-FE-CHECKOUT-SVC-003: prepareCheckout propagates API errors
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as checkoutService from './checkoutService';
import apiClient from '../api/apiClient';
import type {
  CheckoutSummary,
  PrepareCheckoutRequest,
  DeliveryInformation,
} from '../types/checkout.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('checkoutService', () => {
  const mockDelivery: DeliveryInformation = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '0771234567',
    addressLine1: '123 Test Street',
    addressLine2: 'Apt 4',
    city: 'Colombo',
    postalCode: '10100',
    countryCode: 'LK',
  };

  const mockCheckoutSummary: CheckoutSummary = {
    cartId: 'cart-123',
    customerId: 'customer-1',
    preparedAt: '2024-01-01T12:00:00Z',
    currency: 'LKR',
    items: [
      {
        cartItemId: 'item-1',
        productId: 'prod-1',
        name: 'Test Product',
        SKU: 'SKU001',
        quantity: 2,
        unitPrice: '5000.00',
        lineTotal: '10000.00',
      },
    ],
    itemCount: 2,
    subtotal: '10000.00',
    total: '10000.00',
    delivery: mockDelivery,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('prepareCheckout', () => {
    // TC-FE-CHECKOUT-SVC-001
    it('should call POST /checkout/prepare with delivery information', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCheckoutSummary });

      const request: PrepareCheckoutRequest = { delivery: mockDelivery };
      await checkoutService.prepareCheckout(request);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/checkout/prepare', request);
    });

    // TC-FE-CHECKOUT-SVC-002
    it('should return checkout summary on success', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCheckoutSummary });

      const result = await checkoutService.prepareCheckout({ delivery: mockDelivery });

      expect(result).toEqual(mockCheckoutSummary);
      expect(result.cartId).toBe('cart-123');
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe('10000.00');
    });

    // TC-FE-CHECKOUT-SVC-003
    it('should propagate API errors', async () => {
      const error = new Error('Cart is empty');
      mockedApiClient.post.mockRejectedValue(error);

      await expect(
        checkoutService.prepareCheckout({ delivery: mockDelivery }),
      ).rejects.toThrow('Cart is empty');
    });

    it('should include all delivery fields in request', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCheckoutSummary });

      const deliveryWithAllFields: DeliveryInformation = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '0779876543',
        addressLine1: '456 Another St',
        city: 'Kandy',
        postalCode: '20000',
        countryCode: 'LK',
      };

      await checkoutService.prepareCheckout({ delivery: deliveryWithAllFields });

      expect(mockedApiClient.post).toHaveBeenCalledWith('/checkout/prepare', {
        delivery: deliveryWithAllFields,
      });
    });
  });
});
