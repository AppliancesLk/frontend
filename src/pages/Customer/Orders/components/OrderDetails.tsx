import { RatingPlate } from '../../../../components/common/RatingPlate';
import { CopyReference } from '../../../../components/common/CopyReference';
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
      <RatingPlate
        title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
        rows={[
          {
            label: 'Order number',
            value: (
              <span className="flex items-center gap-2 break-all">
                {order.id}
                <CopyReference value={order.id} />
              </span>
            ),
          },
          {
            label: 'Placed',
            value: (
              <time dateTime={order.createdAt}>
                {formatDate(order.createdAt)}
              </time>
            ),
          },
          {
            label: 'Status',
            value: <OrderStatusBadge status={order.status} />,
          },
          { label: 'Total', value: formatCurrency(order.total) },
        ]}
      />
      <OrderProgress status={order.status} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-labelledby="order-items"
          className="min-w-0 rounded-md border border-line bg-surface "
        >
          <h2
            id="order-items"
            className="border-b border-line p-4 text-xl font-semibold text-fg sm:px-6"
          >
            {t.items}
          </h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <ProductImage
                    src={item.images[0]}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-sm border border-line-subtle"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-fg">
                      {item.name}
                    </h3>
                    <p className="mt-1 break-all text-xs text-fg-muted">
                      {item.SKU}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-fg-muted">
                      {translations.cart.quantity}
                    </dt>
                    <dd className="mt-1 text-fg">{item.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-fg-muted">
                      {translations.cart.unitPrice}
                    </dt>
                    <dd className="mt-1 break-words text-fg">
                      {formatCurrency(item.unitPrice)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-fg-muted">
                      {translations.cart.lineTotal}
                    </dt>
                    <dd className="mt-1 break-words font-semibold text-fg">
                      {formatCurrency(item.lineTotal)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-line p-4 text-sm sm:p-6">
            <div className="flex flex-wrap justify-between gap-2 text-fg-secondary">
              <dt>{translations.cart.subtotal}</dt>
              <dd>{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-base font-semibold text-fg">
              <dt>{t.total}</dt>
              <dd>{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </section>
        <section
          aria-labelledby="order-delivery"
          className="min-w-0 rounded-md border border-line bg-surface p-4  sm:p-6"
        >
          <h2 id="order-delivery" className="text-xl font-semibold text-fg">
            {t.delivery}
          </h2>
          {delivery ? (
            <address className="mt-4 space-y-2 break-words text-sm not-italic text-fg-secondary">
              <p className="font-medium text-fg">
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
            <p className="mt-4 text-sm text-fg-muted">{t.noDelivery}</p>
          )}
        </section>
      </div>
    </>
  );
}
