import type { CartItem } from '../../../../types/cart.types';

export function canChangeQuantity(item: CartItem): boolean {
  return (
    item.stockQty > 0 && (item.isAvailable || item.quantity > item.stockQty)
  );
}
export function nextQuantity(item: CartItem, direction: -1 | 1): number | null {
  if (!canChangeQuantity(item)) return null;
  const quantity =
    direction === -1
      ? Math.min(item.quantity - 1, item.stockQty)
      : item.quantity + 1;
  return Number.isInteger(quantity) &&
    quantity > 0 &&
    quantity <= Math.min(item.stockQty, 2147483647)
    ? quantity
    : null;
}
