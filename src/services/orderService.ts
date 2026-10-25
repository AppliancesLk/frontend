import apiClient from '../api/apiClient';
import type {
  AdminOrder,
  CreateOrderRequest,
  Order,
  OrderStatus,
} from '../types/order.types';
export const createOrder = async (input: CreateOrderRequest): Promise<Order> =>
  (await apiClient.post<Order>('/orders', input)).data;
export const getOrders = async (signal?: AbortSignal): Promise<Order[]> =>
  (await apiClient.get<Order[]>('/orders', { signal })).data;
export const cancelOrder = async (id: string): Promise<Order> =>
  (await apiClient.post<Order>(`/orders/${encodeURIComponent(id)}/cancel`))
    .data;
export const getOrder = async (
  id: string,
  signal?: AbortSignal,
): Promise<Order> =>
  (await apiClient.get<Order>(`/orders/${encodeURIComponent(id)}`, { signal }))
    .data;
export const getAdminOrders = async (
  signal?: AbortSignal,
): Promise<AdminOrder[]> =>
  (await apiClient.get<AdminOrder[]>('/admin/orders', { signal })).data;
export const getAdminOrder = async (
  id: string,
  signal?: AbortSignal,
): Promise<AdminOrder> =>
  (
    await apiClient.get<AdminOrder>(`/admin/orders/${encodeURIComponent(id)}`, {
      signal,
    })
  ).data;
export const updateAdminOrderStatus = async (
  id: string,
  status: OrderStatus,
  paymentCollected = false,
): Promise<AdminOrder> =>
  (
    await apiClient.patch<AdminOrder>(
      `/admin/orders/${encodeURIComponent(id)}/status`,
      { status, paymentCollected },
    )
  ).data;
