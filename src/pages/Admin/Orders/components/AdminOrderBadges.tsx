import type { OrderStatus } from '../../../../types/order.types';
import { translations } from '../../../../utils/translations';

export function AdminOrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === 'DELIVERED'
      ? 'bg-green-50 text-green-700'
      : status === 'CANCELLED'
        ? 'bg-red-50 text-red-700'
        : status === 'PENDING_PAYMENT'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-sky-50 text-sky-700';
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {translations.orders.statuses[status]}
    </span>
  );
}

export function PaymentBadge({
  status,
}: {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
}) {
  const tone =
    status === 'SUCCESS'
      ? 'bg-green-50 text-green-700'
      : status === 'PENDING'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {translations.adminOrders.paymentStatuses[status]}
    </span>
  );
}
