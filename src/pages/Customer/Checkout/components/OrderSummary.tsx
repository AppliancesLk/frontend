import type { Cart } from '../../../../types/cart.types';
import type { CheckoutSummary } from '../../../../types/checkout.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
const t = translations.checkout;
export function OrderSummary({
  cart,
  summary,
  preview,
}: {
  cart: Cart;
  summary: CheckoutSummary | null;
  preview: CheckoutSummary | null;
}) {
  const current = summary ?? preview;
  const items = current
    ? current.items.map((item) => ({ ...item, id: item.cartItemId }))
    : cart.items;
  return (
    <aside
      aria-labelledby="checkout-summary"
      className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6"
    >
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <h2
          id="checkout-summary"
          className="text-xl font-semibold text-slate-900"
        >
          {t.summary}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {items.length}{' '}
          {items.length === 1
            ? translations.cart.product
            : translations.cart.products}
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 p-5 sm:px-6">
            <ProductImage
              src={
                cart.items.find(
                  (product) => product.productId === item.productId,
                )?.images[0]
              }
              alt={item.name}
              className="h-16 w-16 shrink-0 rounded-lg border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-semibold text-slate-900">
                {item.name}
              </h3>
              <p className="mt-1 break-all text-xs text-slate-500">
                {translations.productDetails.sku}: {item.SKU}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {translations.cart.quantity}: {item.quantity}{' '}
                <span aria-hidden="true">/</span>{' '}
                {formatCurrency(item.unitPrice)} {t.each}
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {translations.cart.lineTotal}: {formatCurrency(item.lineTotal)}
              </p>
              {!current &&
                !cart.items.find((product) => product.id === item.id)
                  ?.isAvailable && (
                  <p className="mt-2 text-xs text-amber-800">
                    {t.unavailableItem}
                  </p>
                )}
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-200 p-5 sm:p-6">
        <dl className="space-y-4">
          <div className="flex flex-wrap justify-between gap-3 text-sm">
            <dt className="text-slate-500">{translations.cart.subtotal}</dt>
            <dd className="break-all font-medium text-slate-900">
              {formatCurrency(current?.subtotal ?? cart.subtotal)}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-slate-200 pt-4">
            <dt className="font-semibold text-slate-900">{t.finalAmount}</dt>
            <dd
              className={
                summary
                  ? 'break-all text-2xl font-semibold text-slate-900'
                  : 'text-sm text-slate-500'
              }
            >
              {summary ? formatCurrency(summary.total) : t.awaitingValidation}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          {summary ? t.validatedAmount : t.amountHint}
        </p>
      </div>
    </aside>
  );
}
