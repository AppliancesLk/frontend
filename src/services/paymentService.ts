import apiClient from "../api/apiClient";
import type { Payment, PaymentInitiation } from "../types/payment.types";

export const initiatePayment = async (
  orderId: string,
): Promise<PaymentInitiation> =>
  (await apiClient.post<PaymentInitiation>("/payments/initiate", { orderId }))
    .data;

export const getOrderPayment = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<Payment> =>
  (
    await apiClient.get<Payment>(
      `/payments/orders/${encodeURIComponent(orderId)}`,
      { signal },
    )
  ).data;
