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

const t = translations.adminOrders;
export function AdminOrderDetails({
  order,
  page,
}: {
  order: AdminOrder;
  page: ReturnType<typeof useAdminOrdersPage>;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
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
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-slate-500">{translations.orders.id}</dt>
            <dd className="mt-2 break-all font-medium text-slate-900">
              {order.id}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.customer}</dt>
            <dd className="mt-2 font-medium text-slate-900">
              {order.customer.username}
            </dd>
            <dd className="mt-1 break-all text-slate-500">
              {order.customer.email}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{translations.orders.date}</dt>
            <dd className="mt-2 text-slate-900">
              {formatDate(order.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{translations.orders.total}</dt>
            <dd className="mt-2 text-lg font-semibold text-slate-900">
              {formatCurrency(order.total)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{translations.orders.status}</dt>
            <dd className="mt-2">
              <AdminOrderStatusBadge status={order.status} />
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">{t.payment}</dt>
            <dd className="mt-2">
              {order.payment ? (
                <PaymentBadge status={order.payment.status} />
              ) : (
                <span className="text-slate-500">{t.noPayment}</span>
              )}
            </dd>
          </div>
        </dl>
      </section>
      <OrderProgress status={order.status} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 p-5 text-xl font-semibold text-slate-900">
            {translations.orders.items}
          </h2>
          <ul className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="grid gap-3 p-5 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.SKU}</p>
                </div>
                <div>
                  <span className="text-slate-500">
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
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {t.updateStatus}
            </h2>
            {page.updateError && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {page.updateError}
              </p>
            )}
            {page.success && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                {page.success}
              </p>
            )}
            {transitions.length ? (
              <div className="mt-4 space-y-3">
                {transitions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={page.saving}
                    onClick={() => {
                      if (status === 'CANCELLED') setConfirmCancel(true);
                      else void page.updateStatus(status);
                    }}
                    className={
                      status === 'CANCELLED'
                        ? 'auth-secondary w-full text-red-700'
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
              <p className="mt-4 text-sm text-slate-500">{t.finalStatus}</p>
            )}
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {translations.orders.delivery}
            </h2>
            <address className="mt-4 space-y-2 break-words text-sm not-italic text-slate-600">
              <p className="font-medium text-slate-900">
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
