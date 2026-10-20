import { EmptyState } from '../../../../components/ui/Feedback';
import { Link, generatePath } from 'react-router-dom';
import type { Order } from '../../../../types/order.types';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { OrderStatusBadge } from './OrderStatusBadge';
const t = translations.orders;
export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length)
    return (
      <EmptyState
        title={t.empty}
        description={t.emptyDescription}
        action={
          <Link to={ROUTES.products} className="auth-primary mt-6">
            {translations.common.continueShopping}
          </Link>
        }
        icon="orders"
      />
    );
  return (
    <section aria-label={t.title} className="space-y-4">
      <p className="text-sm text-slate-500">{t.newest}</p>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 break-all text-sm font-semibold text-slate-900">
                {t.id}: {order.id}
              </p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <dl className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">{t.date}</dt>
                  <dd className="mt-1 text-slate-900">
                    <time dateTime={order.createdAt}>
                      {formatDate(order.createdAt)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{t.total}</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {formatCurrency(order.total)}
                  </dd>
                </div>
              </dl>
              <Link
                to={generatePath(ROUTES.orderDetail, { id: order.id })}
                className="auth-primary"
                aria-label={`${t.view} ${order.id}`}
              >
                {t.view} &rarr;
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
