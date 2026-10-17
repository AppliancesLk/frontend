import apiClient from "../api/apiClient";
import type { CreateOrderRequest, Order } from "../types/order.types";
export const createOrder = async (input: CreateOrderRequest): Promise<Order> =>
  (await apiClient.post<Order>("/orders", input)).data;
export const getOrders = async (signal?: AbortSignal): Promise<Order[]> =>
  (await apiClient.get<Order[]>("/orders", { signal })).data;
export const getOrder = async (
  id: string,
  signal?: AbortSignal,
): Promise<Order> =>
  (await apiClient.get<Order>(`/orders/${encodeURIComponent(id)}`, { signal }))
    .data;
