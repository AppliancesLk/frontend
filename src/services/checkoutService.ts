import apiClient from '../api/apiClient';
import type {
  CheckoutSummary,
  PrepareCheckoutRequest,
} from '../types/checkout.types';
export const prepareCheckout = async (
  input: PrepareCheckoutRequest,
): Promise<CheckoutSummary> =>
  (await apiClient.post<CheckoutSummary>('/checkout/prepare', input)).data;
