import type { PayHerePaymentData } from "../../../../types/payment.types";

export interface PayHereSdk {
  onCompleted?: (orderId: string) => void;
  onDismissed?: () => void;
  onError?: (error: string) => void;
  startPayment: (payment: PayHerePaymentData) => void;
}

declare global {
  interface Window {
    payhere?: PayHereSdk;
  }
}
