import type { Cart } from '../../../../types/cart.types';
import type { CheckoutSummary } from '../../../../types/checkout.types';
import { ProductImage } from '../../../../components/common/ProductImage';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
import { commerceText } from '../../../../utils/commerceText';
const t = translations.checkout;
export function OrderSummary({
  cart,
  summary,
  preview,
  credit = '0.00',
  amountDue,
}: {
  cart: Cart;
  summary: CheckoutSummary | null;
  preview: CheckoutSummary | null;
  credit?: string;
  amountDue?: string;
}) {
  const current = summary ?? preview;
  const items = current
    ? current.items.map((item) => ({ ...item, id: item.cartItemId }))
    : cart.items;
  return (
    <aside
      aria-labelledby="checkout-summary"
      className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface lg:sticky lg:top-24"
    >
      <div className="border-b border-line p-5 sm:p-6">
        <h2 id="checkout-summary" className="text-xl font-semibold text-fg">
          {t.summary}
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          {items.length}{' '}
          {items.length === 1
            ? translations.cart.product
            : translations.cart.products}
        </p>
      </div>
      <ul className="divide-y divide-line-subtle">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 p-5 sm:px-6">
            <ProductImage
              src={
                cart.items.find(
                  (product) => product.productId === item.productId,
                )?.images[0]
              }
              alt={item.name}
              className="h-16 w-16 shrink-0 rounded-sm border border-line"
            />
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-semibold text-fg">
                {item.name}
              </h3>
              <p className="mt-1 break-all text-xs text-fg-muted">
                {translations.productDetails.sku}: {item.SKU}
              </p>
              <p className="mt-2 text-xs text-fg-secondary">
                {translations.cart.quantity}: {item.quantity}{' '}
                <span aria-hidden="true">/</span>{' '}
                {formatCurrency(item.unitPrice)} {t.each}
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-fg">
                {translations.cart.lineTotal}: {formatCurrency(item.lineTotal)}
              </p>
              {!current &&
                !cart.items.find((product) => product.id === item.id)
                  ?.isAvailable && (
                  <p className="mt-2 text-xs text-warning">
                    {t.unavailableItem}
                  </p>
                )}
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-line p-5 sm:p-6">
        <dl className="space-y-4">
          <div className="flex flex-wrap justify-between gap-3 text-sm">
            <dt className="text-fg-muted">{translations.cart.subtotal}</dt>
            <dd className="break-all font-medium text-fg">
              {formatCurrency(current?.subtotal ?? cart.subtotal)}
            </dd>
          </div>
          {credit !== '0.00' && (
            <div className="flex flex-wrap justify-between gap-3 text-sm text-success">
              <dt>{commerceText.creditUsed}</dt>
              <dd>−{formatCurrency(credit)}</dd>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-4">
            <dt className="font-semibold text-fg">
              {summary ? t.finalAmount : 'Items total'}
            </dt>
            <dd
              className={
                summary
                  ? 'break-all text-2xl font-semibold text-fg'
                  : 'text-sm text-fg-muted'
              }
            >
              {formatCurrency(
                amountDue ??
                  summary?.total ??
                  current?.subtotal ??
                  cart.subtotal,
              )}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-fg-muted">
          {summary ? t.validatedAmount : t.amountHint}
        </p>
      </div>
    </aside>
  );
}
