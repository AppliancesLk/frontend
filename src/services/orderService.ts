import apiClient from '../api/apiClient';
import type { Order } from '../types/order.types';
export const getOrders = async (signal?: AbortSignal): Promise<Order[]> =>
  (await apiClient.get<Order[]>('/orders', { signal })).data;
export const getOrder = async (
  id: string,
  signal?: AbortSignal,
): Promise<Order> =>
  (await apiClient.get<Order>(`/orders/${encodeURIComponent(id)}`, { signal }))
    .data;
