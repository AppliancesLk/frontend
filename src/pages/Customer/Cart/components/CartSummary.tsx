import type { Cart } from '../../../../types/cart.types';
import { formatCurrency } from '../../../../utils/currency';
import { translations } from '../../../../utils/translations';
const t = translations.cart;
export function CartSummary({ cart, busy }: { cart: Cart; busy: boolean }) {
  return (
    <aside
      aria-labelledby="cart-summary"
      aria-busy={busy}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6"
    >
      <h2 id="cart-summary" className="text-lg font-semibold text-slate-900">
        {t.summary}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {cart.itemCount} {cart.itemCount === 1 ? t.product : t.products}
      </p>
      <dl className="mt-6 border-y border-slate-200 py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <dt className="font-medium text-slate-700">{t.subtotal}</dt>
          <dd className="break-all text-2xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(cart.subtotal)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-slate-500">{t.priceNotice}</p>
      <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-800">
        {t.stockNotice}
      </p>
    </aside>
  );
}
