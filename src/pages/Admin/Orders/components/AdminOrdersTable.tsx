import { EmptyState } from '../../../../components/ui/Feedback';
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
      <EmptyState
        title={t.empty}
        description={t.emptyDescription}
        icon="orders"
      />
    );
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface ">
      <table className="ui-table ui-card-table min-w-full text-left text-sm">
        <thead className="bg-page text-fg-secondary">
          <tr>
            <th className="px-5 py-4 font-medium">{translations.orders.id}</th>
            <th className="px-5 py-4 font-medium">{t.customer}</th>
            <th className="px-5 py-4 font-medium">
              {translations.orders.date}
            </th>
            <th className="px-5 py-4 font-medium">
              {translations.orders.total}
            </th>
            <th className="px-5 py-4 font-medium">{t.payment}</th>
            <th className="px-5 py-4 font-medium">
              {translations.orders.status}
            </th>
            <th className="px-5 py-4">
              <span className="sr-only">{translations.orders.view}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr key={order.id}>
              <td
                data-label={translations.orders.id}
                className="xl:max-w-48 xl:truncate px-5 py-4 tabular-nums text-xs text-fg-secondary"
              >
                <div className="ui-cell-value">{order.id}</div>
              </td>
              <td data-label={t.customer} className="px-5 py-4">
                <div className="ui-cell-value">
                  <p className="font-medium text-fg">
                    {order.customer.username}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {order.customer.email}
                  </p>
                </div>
              </td>
              <td
                data-label={translations.orders.date}
                className="xl:whitespace-nowrap px-5 py-4 text-fg-secondary"
              >
                <div className="ui-cell-value">
                  {formatDate(order.createdAt)}
                </div>
              </td>
              <td
                data-label={translations.orders.total}
                className="xl:whitespace-nowrap px-5 py-4 font-semibold text-fg"
              >
                <div className="ui-cell-value">
                  {formatCurrency(order.total)}
                </div>
              </td>
              <td data-label={t.payment} className="px-5 py-4">
                <div className="ui-cell-value">
                  {order.payment ? (
                    <PaymentBadge status={order.payment.status} />
                  ) : (
                    <span className="text-fg-muted">{t.noPayment}</span>
                  )}
                </div>
              </td>
              <td data-label={translations.orders.status} className="px-5 py-4">
                <div className="ui-cell-value">
                  <AdminOrderStatusBadge status={order.status} />
                </div>
              </td>
              <td
                data-label={translations.admin.actions}
                className="px-5 py-4 text-right"
              >
                <div className="ui-cell-value">
                  <Link
                    className="font-medium text-fg-link hover:text-fg-link"
                    to={generatePath(ROUTES.adminOrderDetail, { id: order.id })}
                  >
                    {translations.orders.view}
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
