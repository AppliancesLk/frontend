import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import type { AdminOrder } from '../../../../types/order.types';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { translations } from '../../../../utils/translations';
import { AdminOrderStatusBadge, PaymentBadge } from './AdminOrderBadges';

const t = translations.adminOrders;

export function AdminOrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (!orders.length)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t.empty}</h2>
        <p className="mt-2 text-sm text-slate-500">{t.emptyDescription}</p>
      </div>
    );
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-5 py-4 font-medium">{translations.orders.id}</th>
            <th className="px-5 py-4 font-medium">{t.customer}</th>
            <th className="px-5 py-4 font-medium">{translations.orders.date}</th>
            <th className="px-5 py-4 font-medium">{translations.orders.total}</th>
            <th className="px-5 py-4 font-medium">{t.payment}</th>
            <th className="px-5 py-4 font-medium">{translations.orders.status}</th>
            <th className="px-5 py-4"><span className="sr-only">{translations.orders.view}</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="max-w-48 truncate px-5 py-4 font-mono text-xs text-slate-600">{order.id}</td>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900">{order.customer.username}</p>
                <p className="text-xs text-slate-500">{order.customer.email}</p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(order.createdAt)}</td>
              <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{formatCurrency(order.total)}</td>
              <td className="px-5 py-4">{order.payment ? <PaymentBadge status={order.payment.status} /> : <span className="text-slate-500">{t.noPayment}</span>}</td>
              <td className="px-5 py-4"><AdminOrderStatusBadge status={order.status} /></td>
              <td className="px-5 py-4 text-right">
                <Link className="font-medium text-blue-600 hover:text-blue-700" to={generatePath(ROUTES.adminOrderDetail, { id: order.id })}>{translations.orders.view}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
