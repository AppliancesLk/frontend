import { useState } from 'react';
import { Dialog } from '../../../../components/ui/Dialog';
import { Button } from '../../../../components/ui/Button';
import { uiText } from '../../../../utils/uiText';
import { OrderProgress } from '../../../../components/ui/OrderProgress';
import { Spinner } from '../../../../components/ui/Feedback';
import type { AdminOrder } from '../../../../types/order.types';
import { formatCurrency } from '../../../../utils/currency';
import { formatDate } from '../../../../utils/date';
import { translations } from '../../../../utils/translations';
import { nextOrderStatuses } from '../helpers/admin-order.helpers';
import type { useAdminOrdersPage } from '../hooks/useAdminOrdersPage';
import { AdminOrderStatusBadge, PaymentBadge } from './AdminOrderBadges';
import { commerceText as c } from '../../../../utils/commerceText';
import { OrderTimeline } from '../../../../components/common/OrderTimeline';

const t = translations.adminOrders;
export function AdminOrderDetails({
  order,
  page,
}: {
  order: AdminOrder;
  page: ReturnType<typeof useAdminOrdersPage>;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cashCollected, setCashCollected] = useState(false);
  const transitions = nextOrderStatuses(order.status);
  return (
    <div className="space-y-6">
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title={uiText.cancelOrder}
        description={uiText.cancelOrderDescription}
        busy={page.saving}
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            disabled={page.saving}
            onClick={() => setConfirmCancel(false)}
          >
            {uiText.cancel}
          </Button>
          <Button
            variant="danger"
            busy={page.saving}
            onClick={async () => {
              await page.updateStatus('CANCELLED');
              setConfirmCancel(false);
            }}
          >
            {uiText.cancelOrderAction}
          </Button>
        </div>
      </Dialog>
      <section className="rounded-md border border-line bg-surface p-5  sm:p-6">
        <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-fg-muted">{translations.orders.id}</dt>
            <dd className="mt-2 break-all font-medium text-fg">{order.id}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t.customer}</dt>
            <dd className="mt-2 font-medium text-fg">
              {order.customer.username}
            </dd>
            <dd className="mt-1 break-all text-fg-muted">
              {order.customer.email}
            </dd>
          </div>
          <div>
            <dt className="text-fg-muted">{translations.orders.date}</dt>
            <dd className="mt-2 text-fg">{formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{translations.orders.total}</dt>
            <dd className="mt-2 text-lg font-semibold text-fg">
              {formatCurrency(order.total)}
            </dd>
          </div>
          <div>
            <dt className="text-fg-muted">{translations.orders.status}</dt>
            <dd className="mt-2">
              <AdminOrderStatusBadge status={order.status} />
            </dd>
          </div>
          <div>
            <dt className="text-fg-muted">{t.payment}</dt>
            <dd className="mt-2">
              {order.payment ? (
                <PaymentBadge status={order.payment.status} />
              ) : (
                <span className="text-fg-muted">{t.noPayment}</span>
              )}
            </dd>
          </div>
        </dl>
      </section>
      <OrderProgress
        status={order.status}
        paymentMethod={order.paymentMethod}
      />
      <OrderTimeline history={order.history} />
      <div className="ui-panel flex flex-wrap gap-6 p-5 text-sm">
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
        <p>
          {c.creditUsed}:{' '}
          <strong>{formatCurrency(order.loyaltyRedeemed ?? '0.00')}</strong>
        </p>
        <p>
          {c.earned}:{' '}
          <strong>{formatCurrency(order.loyaltyEarned ?? '0.00')}</strong>
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-md border border-line bg-surface ">
          <h2 className="border-b border-line p-5 text-xl font-semibold text-fg">
            {translations.orders.items}
          </h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="grid gap-3 p-5 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold text-fg">{item.name}</p>
                  <p className="mt-1 text-xs text-fg-muted">{item.SKU}</p>
                </div>
                <div>
                  <span className="text-fg-muted">
                    {translations.cart.quantity}:{' '}
                  </span>
                  {item.quantity}
                </div>
                <div>{formatCurrency(item.unitPrice)}</div>
                <div className="font-semibold">
                  {formatCurrency(item.lineTotal)}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-6">
          <section className="rounded-md border border-line bg-surface p-5 ">
            <h2 className="text-xl font-semibold text-fg">{t.updateStatus}</h2>
            {page.updateError && (
              <p
                role="alert"
                className="mt-4 rounded-sm bg-danger-bg p-3 text-sm text-danger"
              >
                {page.updateError}
              </p>
            )}
            {page.success && (
              <p
                role="status"
                className="mt-4 rounded-sm bg-success-bg p-3 text-sm text-success"
              >
                {page.success}
              </p>
            )}
            {transitions.length ? (
              <div className="mt-4 space-y-3">
                {order.status === 'SHIPPED' &&
                  order.paymentMethod === 'CASH_ON_DELIVERY' &&
                  order.payment?.status !== 'SUCCESS' && (
                    <label className="flex items-start gap-3 rounded-sm bg-warning-bg p-3 text-sm text-warning">
                      <input
                        type="checkbox"
                        checked={cashCollected}
                        onChange={(e) => setCashCollected(e.target.checked)}
                        disabled={page.saving}
                        className="mt-1 h-5 w-5 shrink-0 accent-primary"
                      />
                      {c.cashCollected}
                    </label>
                  )}
                {transitions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={
                      page.saving ||
                      (status === 'DELIVERED' &&
                        order.paymentMethod === 'CASH_ON_DELIVERY' &&
                        order.payment?.status !== 'SUCCESS' &&
                        !cashCollected)
                    }
                    onClick={() => {
                      if (status === 'CANCELLED') setConfirmCancel(true);
                      else void page.updateStatus(status, cashCollected);
                    }}
                    className={
                      status === 'CANCELLED'
                        ? 'auth-secondary w-full text-danger'
                        : 'auth-primary w-full'
                    }
                  >
                    {page.saving && <Spinner className="mr-2" />}
                    {page.saving
                      ? t.savingStatus
                      : `${t.saveStatus}: ${translations.orders.statuses[status]}`}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-fg-muted">{t.finalStatus}</p>
            )}
          </section>
          <section className="rounded-md border border-line bg-surface p-5 ">
            <h2 className="text-xl font-semibold text-fg">
              {translations.orders.delivery}
            </h2>
            <address className="mt-4 space-y-2 break-words text-sm not-italic text-fg-secondary">
              <p className="font-medium text-fg">
                {order.delivery?.firstName} {order.delivery?.lastName}
              </p>
              <p>{order.delivery?.addressLine1}</p>
              {order.delivery?.addressLine2 && (
                <p>{order.delivery.addressLine2}</p>
              )}
              <p>
                {order.delivery?.city} {order.delivery?.postalCode}
              </p>
              <p>{order.delivery?.phone}</p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
