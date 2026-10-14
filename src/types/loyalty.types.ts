export interface LoyaltySummary {
  balance: string;
  currency: 'LKR';
  ratePercent: string;
  entries: {
    id: string;
    orderId: string;
    kind: 'EARN' | 'REDEEM' | 'REFUND';
    amount: string;
    createdAt: string;
  }[];
}
