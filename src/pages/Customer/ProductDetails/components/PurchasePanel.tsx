import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { LoadingState } from '../../../../components/ui/Feedback';
import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../../../../types/product.types';
import { useAuth } from '../../../../hooks/useAuth';
import { USER_ROLES } from '../../../../constants/roles';
import { ROUTES } from '../../../../constants/routes';
import { addCartItem } from '../../../../services/cartService';
import { formatCurrency } from '../../../../utils/currency';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
import { Icon } from '../../../../components/common/Icon';
const t = translations.experience;
export function PurchasePanel({ product }: { product: Product }) {
  const { user, loading } = useAuth(),
    navigate = useNavigate(),
    location = useLocation();
  const [quantity, setQuantity] = useState(1),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [added, setAdded] = useState(false);
  const pending = useRef(false);
  const available = product.isActive && product.stockQty > 0;
  async function purchase(buyNow: boolean) {
    if (
      pending.current ||
      !available ||
      quantity < 1 ||
      quantity > product.stockQty
    )
      return;
    pending.current = true;
    setBusy(true);
    setError('');
    setAdded(false);
    try {
      await addCartItem({ productId: product.productID, quantity });
      setAdded(true);
      if (buyNow) navigate(ROUTES.checkout);
    } catch (error) {
      setError(getApiError(error, t.purchaseError));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <section
      aria-label={t.purchaseOptions}
      className="rounded-xl border border-slate-200 bg-white p-5 xl:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={available ? 'IN_STOCK' : 'OUT_OF_STOCK'}>
          {available
            ? translations.productDetails.inStock
            : translations.productDetails.outOfStock}
        </StatusBadge>
        <span className="break-all text-xs text-slate-500">
          {translations.productDetails.sku}: {product.SKU}
        </span>
      </div>
      <p className="mt-5 break-words text-3xl font-bold tracking-tight text-blue-700">
        {formatCurrency(product.price)}
      </p>
      {product.compareAtPrice != null &&
        Number(product.compareAtPrice) > Number(product.price) && (
          <p className="mt-2 text-sm text-slate-400">
            <s>{formatCurrency(product.compareAtPrice)}</s>
          </p>
        )}
      <p className="mt-3 text-xs leading-5 text-slate-500">
        {product.warranty || t.noWarranty}
      </p>
      <label
        htmlFor="purchase-quantity"
        className="mb-2 mt-6 block text-sm font-semibold text-slate-900"
      >
        {t.quantity}
      </label>
      <div className="mb-5 flex w-fit items-center overflow-hidden rounded-lg border border-slate-200">
        <button
          aria-label={t.decrease}
          disabled={busy || quantity <= 1}
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="min-h-11 w-11 bg-slate-50 text-blue-700 disabled:opacity-30"
        >
          −
        </button>
        <input
          id="purchase-quantity"
          aria-label={t.quantity}
          type="number"
          min={1}
          max={Math.max(product.stockQty, 1)}
          step={1}
          disabled={busy || !available}
          value={quantity}
          onChange={(event) => {
            const value = Number(event.target.value);
            setQuantity(
              Number.isInteger(value)
                ? Math.min(Math.max(value, 1), Math.max(product.stockQty, 1))
                : 1,
            );
          }}
          className="ui-field min-h-11 w-16 border-x border-slate-200 bg-white text-center text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          aria-label={t.increase}
          disabled={busy || quantity >= product.stockQty}
          onClick={() =>
            setQuantity((value) => Math.min(product.stockQty, value + 1))
          }
          className="min-h-11 w-11 bg-slate-50 text-blue-700 disabled:opacity-30"
        >
          +
        </button>
      </div>
      {loading ? (
        <LoadingState label={t.loading} compact={true} />
      ) : !user ? (
        <Link
          to={ROUTES.login}
          state={{ from: location.pathname }}
          className="auth-primary w-full"
        >
          {t.signIn}
        </Link>
      ) : user.role === USER_ROLES.CUSTOMER ? (
        <div className="space-y-3">
          <button
            disabled={busy || !available}
            onClick={() => void purchase(false)}
            className="ui-button ui-button-primary flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Icon name="cart" />
            {busy ? t.adding : t.addToCart}
          </button>
          <button
            disabled={busy || !available}
            onClick={() => void purchase(true)}
            className="ui-button ui-button-secondary min-h-12 w-full disabled:opacity-40"
          >
            {t.buyNow} →
          </button>
        </div>
      ) : null}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="mt-4 text-sm text-green-700">
          {t.added}{' '}
          <Link to={ROUTES.cart} className="underline">
            {translations.cart.view}
          </Link>
        </p>
      )}
    </section>
  );
}
