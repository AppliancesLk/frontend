import { OrderProgress } from '../../../../components/ui/OrderProgress';
import type { Order } from '../../../../types/order.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { translations } from '../../../../utils/translations';
import { OrderStatusBadge } from './OrderStatusBadge';
const t = translations.orders;
export function OrderDetails({ order }: { order: Order }) {
  const delivery = order.delivery;
  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <dt className="text-slate-500">{t.id}</dt>
            <dd className="mt-2 break-all font-medium text-slate-900">
              {order.id}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.date}</dt>
            <dd className="mt-2 text-slate-900">
              <time dateTime={order.createdAt}>
                {formatDate(order.createdAt)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.status}</dt>
            <dd className="mt-2">
              <OrderStatusBadge status={order.status} />
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.total}</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(order.total)}
            </dd>
          </div>
        </dl>
      </section>
      <OrderProgress status={order.status} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-labelledby="order-items"
          className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <h2
            id="order-items"
            className="border-b border-slate-200 p-4 text-xl font-semibold text-slate-900 sm:px-6"
          >
            {t.items}
          </h2>
          <ul className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <li key={item.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <ProductImage
                    src={item.images[0]}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-lg border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {item.SKU}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-slate-500">
                      {translations.cart.quantity}
                    </dt>
                    <dd className="mt-1 text-slate-900">{item.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">
                      {translations.cart.unitPrice}
                    </dt>
                    <dd className="mt-1 break-words text-slate-900">
                      {formatCurrency(item.unitPrice)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">
                      {translations.cart.lineTotal}
                    </dt>
                    <dd className="mt-1 break-words font-semibold text-slate-900">
                      {formatCurrency(item.lineTotal)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-slate-200 p-4 text-sm sm:p-6">
            <div className="flex flex-wrap justify-between gap-2 text-slate-600">
              <dt>{translations.cart.subtotal}</dt>
              <dd>{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-base font-semibold text-slate-900">
              <dt>{t.total}</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </section>
        <section
          aria-labelledby="order-delivery"
          className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2
            id="order-delivery"
            className="text-xl font-semibold text-slate-900"
          >
            {t.delivery}
          </h2>
          {delivery ? (
            <address className="mt-4 space-y-2 break-words text-sm not-italic text-slate-600">
              <p className="font-medium text-slate-900">
                {delivery.firstName} {delivery.lastName}
              </p>
              <p>{delivery.addressLine1}</p>
              {delivery.addressLine2 && <p>{delivery.addressLine2}</p>}
              <p>
                {delivery.city} {delivery.postalCode}
              </p>
              <p>{delivery.countryCode}</p>
              <p>{delivery.phone}</p>
              <p>{delivery.email}</p>
            </address>
          ) : (
            <p className="mt-4 text-sm text-slate-500">{t.noDelivery}</p>
          )}
        </section>
      </div>
    </>
  );
}
