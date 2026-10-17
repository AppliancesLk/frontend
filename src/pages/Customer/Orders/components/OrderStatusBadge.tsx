import type { OrderStatus } from '../../../../types/order.types';
import { translations } from '../../../../utils/translations';
const colors: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-amber-50 text-amber-800',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  PROCESSING: 'bg-sky-50 text-sky-700',
  SHIPPED: 'bg-sky-50 text-sky-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-slate-100 text-slate-700',
};
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colors[status] ?? 'bg-slate-100 text-slate-700'}`}
    >
      {translations.orders.statuses[status] ?? status}
    </span>
  );
}
