/**
 * @file cartService.test.ts
 * @description Tests for cart service API calls
 *
 * Test Case IDs:
 * - TC-FE-CART-SVC-001: getCart calls correct endpoint
 * - TC-FE-CART-SVC-002: addCartItem calls POST with product data
 * - TC-FE-CART-SVC-003: addCartItem dispatches cart-updated event
 * - TC-FE-CART-SVC-004: updateCartItem calls PATCH with quantity
 * - TC-FE-CART-SVC-005: removeCartItem calls DELETE for item
 * - TC-FE-CART-SVC-006: clearCart calls DELETE on cart
 * - TC-FE-CART-SVC-007: getCart passes abort signal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as cartService from './cartService';
import apiClient from '../api/apiClient';
import type { Cart } from '../types/cart.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('cartService', () => {
  const mockCart: Cart = {
    id: 'cart-123',
    currency: 'LKR',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Test Product',
        SKU: 'SKU001',
        images: ['image1.jpg'],
        quantity: 2,
        stockQty: 10,
        isAvailable: true,
        unitPrice: '1000.00',
        lineTotal: '2000.00',
      },
    ],
    itemCount: 2,
    subtotal: '2000.00',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    // TC-FE-CART-SVC-001
    it('should call GET /cart and return cart data', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockCart });

      const result = await cartService.getCart();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/cart', { signal: undefined });
      expect(result).toEqual(mockCart);
    });

    // TC-FE-CART-SVC-007
    it('should pass abort signal to API call', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockCart });
      const controller = new AbortController();

      await cartService.getCart(controller.signal);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/cart', {
        signal: controller.signal,
      });
    });
  });

  describe('addCartItem', () => {
    // TC-FE-CART-SVC-002
    it('should call POST /cart/items with product data', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCart });

      await cartService.addCartItem({ productId: 'prod-1', quantity: 2 });

      expect(mockedApiClient.post).toHaveBeenCalledWith('/cart/items', {
        productId: 'prod-1',
        quantity: 2,
      });
    });

    // TC-FE-CART-SVC-003
    it('should dispatch cart-updated event after adding item', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCart });
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      await cartService.addCartItem({ productId: 'prod-1', quantity: 1 });

      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      const event = dispatchSpy.mock.calls[0][0] as Event;
      expect(event.type).toBe('cart-updated');
    });

    it('should return updated cart', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockCart });

      const result = await cartService.addCartItem({ productId: 'prod-1', quantity: 1 });

      expect(result).toEqual(mockCart);
    });
  });

  describe('updateCartItem', () => {
    // TC-FE-CART-SVC-004
    it('should call PATCH /cart/items/:id with quantity', async () => {
      mockedApiClient.patch.mockResolvedValue({ data: mockCart });

      await cartService.updateCartItem('item-1', 5);

      expect(mockedApiClient.patch).toHaveBeenCalledWith('/cart/items/item-1', {
        quantity: 5,
      });
    });

    it('should dispatch cart-updated event after update', async () => {
      mockedApiClient.patch.mockResolvedValue({ data: mockCart });
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      await cartService.updateCartItem('item-1', 3);

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should encode item ID in URL', async () => {
      mockedApiClient.patch.mockResolvedValue({ data: mockCart });

      await cartService.updateCartItem('item/with/slashes', 1);

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/cart/items/item%2Fwith%2Fslashes',
        { quantity: 1 },
      );
    });
  });

  describe('removeCartItem', () => {
    // TC-FE-CART-SVC-005
    it('should call DELETE /cart/items/:id', async () => {
      const emptyCart: Cart = { ...mockCart, items: [], itemCount: 0, subtotal: '0.00' };
      mockedApiClient.delete.mockResolvedValue({ data: emptyCart });

      await cartService.removeCartItem('item-1');

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/cart/items/item-1');
    });

    it('should dispatch cart-updated event after removal', async () => {
      mockedApiClient.delete.mockResolvedValue({ data: mockCart });
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      await cartService.removeCartItem('item-1');

      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    // TC-FE-CART-SVC-006
    it('should call DELETE /cart', async () => {
      const emptyCart: Cart = {
        id: null,
        currency: 'LKR',
        items: [],
        itemCount: 0,
        subtotal: '0.00',
      };
      mockedApiClient.delete.mockResolvedValue({ data: emptyCart });

      const result = await cartService.clearCart();

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/cart');
      expect(result.items).toHaveLength(0);
    });

    it('should dispatch cart-updated event after clearing', async () => {
      mockedApiClient.delete.mockResolvedValue({ data: mockCart });
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      await cartService.clearCart();

      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});
