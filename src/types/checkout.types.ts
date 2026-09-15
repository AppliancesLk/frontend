export interface DeliveryInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  countryCode: string;
}
export interface PrepareCheckoutRequest {
  delivery: DeliveryInformation;
}
export interface CheckoutSummary {
  cartId: string;
  customerId: string;
  preparedAt: string;
  currency: 'LKR';
  items: {
    cartItemId: string;
    productId: string;
    name: string;
    SKU: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  }[];
  itemCount: number;
  subtotal: string;
  total: string;
  delivery: DeliveryInformation;
}
