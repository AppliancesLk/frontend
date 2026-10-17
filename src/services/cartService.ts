import apiClient from '../api/apiClient';
import type { AddCartItemRequest, Cart } from '../types/cart.types';

export const getCart = async (signal?: AbortSignal): Promise<Cart> =>
  (await apiClient.get<Cart>('/cart', { signal })).data;
export const addCartItem = async (input: AddCartItemRequest): Promise<Cart> =>
  (await apiClient.post<Cart>('/cart/items', input)).data;
export const updateCartItem = async (
  itemId: string,
  quantity: number,
): Promise<Cart> =>
  (
    await apiClient.patch<Cart>(`/cart/items/${encodeURIComponent(itemId)}`, {
      quantity,
    })
  ).data;
export const removeCartItem = async (itemId: string): Promise<Cart> =>
  (await apiClient.delete<Cart>(`/cart/items/${encodeURIComponent(itemId)}`))
    .data;
export const clearCart = async (): Promise<Cart> =>
  (await apiClient.delete<Cart>('/cart')).data;
