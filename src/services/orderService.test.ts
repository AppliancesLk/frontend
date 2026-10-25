/**
 * @file orderService.test.ts
 * @description Tests for order service API calls
 *
 * Test Case IDs:
 * - TC-FE-ORDER-SVC-001: createOrder calls POST with order data
 * - TC-FE-ORDER-SVC-002: getOrders calls GET /orders
 * - TC-FE-ORDER-SVC-003: getOrder calls GET /orders/:id
 * - TC-FE-ORDER-SVC-004: cancelOrder calls POST /orders/:id/cancel
 * - TC-FE-ORDER-SVC-005: getAdminOrders calls GET /admin/orders
 * - TC-FE-ORDER-SVC-006: updateAdminOrderStatus calls PATCH with status
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as orderService from './orderService';
import apiClient from '../api/apiClient';
import type { Order, AdminOrder, CreateOrderRequest } from '../types/order.types';

vi.mock('../api/apiClient');

const mockedApiClient = vi.mocked(apiClient);

describe('orderService', () => {
  const mockDelivery = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '0771234567',
    addressLine1: '123 Test St',
    addressLine2: '',
    city: 'Colombo',
    postalCode: '10100',
    countryCode: 'LK',
  };

  const mockOrder: Order = {
    id: 'order-123',
    customerId: 'customer-1',
    sourceCartId: 'cart-1',
    status: 'CONFIRMED',
    currency: 'LKR',
    delivery: mockDelivery,
    subtotal: '5000.00',
    total: '5000.00',
    paymentMethod: 'CASH_ON_DELIVERY',
    loyaltyRedeemed: '0.00',
    loyaltyEarned: '50.00',
    history: [{ id: '1', status: 'CONFIRMED', createdAt: '2024-01-01T00:00:00Z' }],
    preparedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Test Product',
        SKU: 'SKU001',
        images: [],
        quantity: 1,
        unitPrice: '5000.00',
        lineTotal: '5000.00',
      },
    ],
  };

  const mockAdminOrder: AdminOrder = {
    ...mockOrder,
    customer: { id: 'customer-1', username: 'testuser', email: 'test@example.com' },
    payment: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    const createRequest: CreateOrderRequest = {
      idempotencyKey: 'idem-key-123',
      delivery: mockDelivery,
      paymentMethod: 'CASH_ON_DELIVERY',
    };

    // TC-FE-ORDER-SVC-001
    it('should call POST /orders with order data', async () => {
      mockedApiClient.post.mockResolvedValue({ data: mockOrder });

      const result = await orderService.createOrder(createRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/orders', createRequest);
      expect(result).toEqual(mockOrder);
    });

    it('should propagate API errors', async () => {
      mockedApiClient.post.mockRejectedValue(new Error('Insufficient stock'));

      await expect(orderService.createOrder(createRequest)).rejects.toThrow(
        'Insufficient stock',
      );
    });
  });

  describe('getOrders', () => {
    // TC-FE-ORDER-SVC-002
    it('should call GET /orders and return order list', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockOrder] });

      const result = await orderService.getOrders();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/orders', { signal: undefined });
      expect(result).toEqual([mockOrder]);
    });

    it('should pass abort signal', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [] });
      const controller = new AbortController();

      await orderService.getOrders(controller.signal);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/orders', {
        signal: controller.signal,
      });
    });
  });

  describe('getOrder', () => {
    // TC-FE-ORDER-SVC-003
    it('should call GET /orders/:id and return order', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockOrder });

      const result = await orderService.getOrder('order-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/orders/order-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockOrder);
    });

    it('should encode order ID in URL', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockOrder });

      await orderService.getOrder('order/with/slashes');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/orders/order%2Fwith%2Fslashes',
        { signal: undefined },
      );
    });
  });

  describe('cancelOrder', () => {
    // TC-FE-ORDER-SVC-004
    it('should call POST /orders/:id/cancel', async () => {
      const cancelledOrder = { ...mockOrder, status: 'CANCELLED' as const };
      mockedApiClient.post.mockResolvedValue({ data: cancelledOrder });

      const result = await orderService.cancelOrder('order-123');

      expect(mockedApiClient.post).toHaveBeenCalledWith('/orders/order-123/cancel');
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('getAdminOrders', () => {
    // TC-FE-ORDER-SVC-005
    it('should call GET /admin/orders and return admin order list', async () => {
      mockedApiClient.get.mockResolvedValue({ data: [mockAdminOrder] });

      const result = await orderService.getAdminOrders();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/orders', {
        signal: undefined,
      });
      expect(result).toEqual([mockAdminOrder]);
    });
  });

  describe('getAdminOrder', () => {
    it('should call GET /admin/orders/:id', async () => {
      mockedApiClient.get.mockResolvedValue({ data: mockAdminOrder });

      const result = await orderService.getAdminOrder('order-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/orders/order-123', {
        signal: undefined,
      });
      expect(result).toEqual(mockAdminOrder);
    });
  });

  describe('updateAdminOrderStatus', () => {
    // TC-FE-ORDER-SVC-006
    it('should call PATCH /admin/orders/:id/status with status', async () => {
      const updatedOrder = { ...mockAdminOrder, status: 'SHIPPED' as const };
      mockedApiClient.patch.mockResolvedValue({ data: updatedOrder });

      const result = await orderService.updateAdminOrderStatus('order-123', 'SHIPPED');

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/admin/orders/order-123/status',
        { status: 'SHIPPED', paymentCollected: false },
      );
      expect(result.status).toBe('SHIPPED');
    });

    it('should include paymentCollected flag when true', async () => {
      mockedApiClient.patch.mockResolvedValue({ data: mockAdminOrder });

      await orderService.updateAdminOrderStatus('order-123', 'DELIVERED', true);

      expect(mockedApiClient.patch).toHaveBeenCalledWith(
        '/admin/orders/order-123/status',
        { status: 'DELIVERED', paymentCollected: true },
      );
    });
  });
});
