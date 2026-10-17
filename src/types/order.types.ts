import type { DeliveryInformation } from "./checkout.types";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  SKU: string;
  images: string[];
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}
export interface Order {
  id: string;
  customerId: string;
  sourceCartId: string;
  status: OrderStatus;
  currency: "LKR";
  delivery: DeliveryInformation | null;
  subtotal: string;
  total: string;
  preparedAt: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
export interface CreateOrderRequest {
  idempotencyKey: string;
  delivery: DeliveryInformation;
}
export interface AdminOrder extends Order {
  customer: { id: string; username: string; email: string };
  payment: {
    id: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
    amount: string;
    currency: string;
    updatedAt: string;
  } | null;
}
