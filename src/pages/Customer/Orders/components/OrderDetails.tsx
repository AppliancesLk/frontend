import { RatingPlate } from '../../../../components/common/RatingPlate';
import { CopyReference } from '../../../../components/common/CopyReference';
import { OrderProgress } from '../../../../components/ui/OrderProgress';
import type { Order } from '../../../../types/order.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { translations } from '../../../../utils/translations';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useRef, useState } from 'react';
import { OrderTimeline } from '../../../../components/common/OrderTimeline';
import { Button } from '../../../../components/ui/Button';
import { Dialog } from '../../../../components/ui/Dialog';
import { cancelOrder } from '../../../../services/orderService';
import { getApiError } from '../../../../utils/apiErrors';
import { commerceText as c } from '../../../../utils/commerceText';
const t = translations.orders;
export function OrderDetails({
  order,
  refresh,
}: {
  order: Order;
  refresh: () => void;
}) {
  const delivery = order.delivery;
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const working = useRef(false);
  const cancellable =
    order.status === 'PENDING_PAYMENT' ||
    (order.status === 'CONFIRMED' &&
      order.paymentMethod === 'CASH_ON_DELIVERY');
  async function cancel() {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError('');
    try {
      await cancelOrder(order.id);
      setConfirmCancel(false);
      refresh();
    } catch (err) {
      setError(getApiError(err, c.cancelError));
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
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
      <OrderProgress
        status={order.status}
        paymentMethod={order.paymentMethod}
      />
      {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
        <p className="text-sm text-fg-muted">{c.tracking}</p>
      )}
      <OrderTimeline history={order.history} />
      <section className="ui-panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="space-y-2 text-sm">
          <p>
            {c.method}:{' '}
            <strong>
              {order.paymentMethod === 'CASH_ON_DELIVERY'
                ? c.cod
                : order.paymentMethod === 'LOYALTY'
                  ? c.loyalty
                  : c.payHere}
            </strong>
          </p>
          {order.paymentMethod === 'CASH_ON_DELIVERY' &&
            order.status !== 'CANCELLED' && (
              <p>
                {order.status === 'DELIVERED' ? c.paid : c.cashDue}:{' '}
                <strong>{formatCurrency(order.total)}</strong>
              </p>
            )}
          <p>
            {c.earned}:{' '}
            <strong>{formatCurrency(order.loyaltyEarned ?? '0.00')}</strong>
          </p>
        </div>
        {cancellable && (
          <Button variant="secondary" onClick={() => setConfirmCancel(true)}>
            {c.cancelOrder}
          </Button>
        )}
      </section>
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title={c.cancelOrder}
        description={c.cancelConfirm}
        busy={busy}
      >
        {error && (
          <p role="alert" className="ui-alert ui-tone-danger">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => setConfirmCancel(false)}
          >
            Keep order
          </Button>
          <Button variant="danger" busy={busy} onClick={() => void cancel()}>
            {c.cancelOrder}
          </Button>
        </div>
      </Dialog>
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
            {order.loyaltyRedeemed && order.loyaltyRedeemed !== '0.00' && (
              <div className="flex flex-wrap justify-between gap-2 text-success">
                <dt>{c.creditUsed}</dt>
                <dd>−{formatCurrency(order.loyaltyRedeemed)}</dd>
              </div>
            )}
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
