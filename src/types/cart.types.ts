export interface CartItem {
  id: string;
  productId: string;
  name: string;
  SKU: string;
  images: string[];
  quantity: number;
  stockQty: number;
  isAvailable: boolean;
  unitPrice: string;
  lineTotal: string;
}
export interface Cart {
  id: string | null;
  currency: 'LKR';
  items: CartItem[];
  itemCount: number;
  subtotal: string;
}
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}
