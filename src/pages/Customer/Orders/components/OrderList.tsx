import { useState } from 'react';
import { CopyReference } from '../../../../components/common/CopyReference';
import { ProductImage } from '../../../../components/common/ProductImage';
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
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visible = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'All' ||
        (filter === 'Delivered'
          ? order.status === 'DELIVERED'
          : filter === 'Cancelled'
            ? order.status === 'CANCELLED'
            : !['DELIVERED', 'CANCELLED'].includes(order.status))),
  );
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex max-w-full gap-5 overflow-x-auto border-b border-line"
          role="group"
          aria-label="Filter orders"
        >
          {['All', 'In progress', 'Delivered', 'Cancelled'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`min-h-11 shrink-0 border-b-2 text-sm ${filter === item ? 'border-primary text-fg' : 'border-transparent text-fg-muted'}`}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="order-search">
          Search by order number
        </label>
        <input
          className="ui-field w-full sm:w-64"
          id="order-search"
          placeholder="Search by order number?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {visible.length === 0 && (
        <p className="py-12 text-center text-sm text-fg-muted">
          No orders match your search.
        </p>
      )}
      <ul className="space-y-4">
        {visible.map((order) => (
          <li
            key={order.id}
            className="rounded-md border border-line bg-surface p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <h2 className="font-sans text-base font-semibold">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <CopyReference value={order.id} />
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-3 flex gap-2">
              {order.items.slice(0, 4).map((item) => (
                <ProductImage
                  key={item.id}
                  src={item.images[0]}
                  alt={item.name}
                  className="h-14 w-14 rounded-sm bg-well p-1"
                />
              ))}
              {order.items.length > 4 && (
                <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-subtle text-sm text-fg-muted">
                  +{order.items.length - 4}
                </span>
              )}
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <dl className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
                <div>
                  <dt className="text-fg-muted">{t.date}</dt>
                  <dd className="mt-1 text-fg">
                    <time dateTime={order.createdAt}>
                      {formatDate(order.createdAt)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-fg-muted">{t.total}</dt>
                  <dd className="mt-1 font-semibold text-fg">
                    {formatCurrency(order.total)}
                  </dd>
                </div>
              </dl>
              <Link
                to={generatePath(ROUTES.orderDetail, { id: order.id })}
                className="auth-secondary"
                aria-label={`${t.view} ${order.id}`}
              >
                {t.view}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
