import { Price } from '../../../../components/common/Price';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { LoadingState } from '../../../../components/ui/Feedback';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../../../../types/product.types';
import { useAuth } from '../../../../hooks/useAuth';
import { USER_ROLES } from '../../../../constants/roles';
import { ROUTES } from '../../../../constants/routes';
import { addCartItem } from '../../../../services/cartService';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
import { Icon } from '../../../../components/common/Icon';
import { notifyToast } from '../../../../utils/toast';
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
  const actions = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const target = actions.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
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
      if (!buyNow)
        notifyToast({
          message: translations.storefront.added,
          action: { label: translations.cart.view, to: ROUTES.cart },
        });
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
      className="purchase-panel rounded-lg border border-line bg-surface p-5 xl:sticky xl:top-24 xl:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge
          status={
            available
              ? product.stockQty <= 5
                ? 'LOW_STOCK'
                : 'IN_STOCK'
              : 'OUT_OF_STOCK'
          }
        >
          {available
            ? product.stockQty <= 5
              ? `Only ${product.stockQty} left`
              : translations.productDetails.inStock
            : translations.productDetails.outOfStock}
        </StatusBadge>
        <span className="break-all text-xs text-fg-muted">
          {translations.productDetails.sku}: {product.SKU}
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight text-fg">
        <Price value={product.price} />
      </p>
      {product.compareAtPrice != null &&
        Number(product.compareAtPrice) > Number(product.price) && (
          <p className="mt-2 text-sm text-fg-muted">
            <s>
              <Price value={product.compareAtPrice} />
            </s>
          </p>
        )}
      <p className="sr-only">{product.warranty || t.noWarranty}</p>
      <label
        htmlFor="purchase-quantity"
        className="mb-2 mt-6 block text-sm font-semibold text-fg"
      >
        {t.quantity}
      </label>
      <div className="mb-5 flex w-fit items-center overflow-hidden rounded-sm border border-line">
        <button
          aria-label={t.decrease}
          disabled={busy || quantity <= 1}
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="min-h-11 w-11 bg-page text-fg-link disabled:text-fg-disabled"
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
          className="ui-field min-h-11 w-16 border-x border-line bg-surface text-center text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          aria-label={t.increase}
          disabled={busy || quantity >= product.stockQty}
          onClick={() =>
            setQuantity((value) => Math.min(product.stockQty, value + 1))
          }
          className="min-h-11 w-11 bg-page text-fg-link disabled:text-fg-disabled"
        >
          +
        </button>
      </div>
      <div ref={actions}>
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
              className="ui-button ui-button-primary flex min-h-12 w-full items-center justify-center gap-3 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-primary-on hover:bg-primary-hover disabled:text-fg-disabled"
            >
              <Icon name="cart" />
              {busy ? t.adding : t.addToCart}
            </button>
            <button
              disabled={busy || !available}
              onClick={() => void purchase(true)}
              className="ui-button ui-button-accent min-h-12 w-full"
            >
              {t.buyNow}
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-6 space-y-3 border-t border-line-subtle pt-5 text-xs text-fg-secondary">
        <p className="flex items-center gap-2">
          <Icon name="truck" className="h-4 w-4" />
          Delivery details at checkout
        </p>
        <p className="flex items-center gap-2">
          <Icon name="shield" className="h-4 w-4" />
          {product.warranty || 'Ask our team about warranty'}
        </p>
        <Link
          to={ROUTES.repairRequest}
          className="flex items-center gap-2 text-fg-link"
        >
          <Icon name="repair" className="h-4 w-4" />
          Care and repair support
        </Link>
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-sm bg-danger-bg p-3 text-sm text-danger"
        >
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="mt-4 text-sm text-success">
          {t.added}{' '}
          <Link to={ROUTES.cart} className="underline">
            {translations.cart.view}
          </Link>
        </p>
      )}
      {sticky && user?.role === USER_ROLES.CUSTOMER && (
        <div className="purchase-sticky-bar">
          <div>
            <span className="block text-xs text-fg-muted">
              {available ? 'In stock' : 'Out of stock'}
            </span>
            <Price value={product.price} className="text-sm font-semibold" />
          </div>
          <button
            type="button"
            onClick={() => void purchase(false)}
            disabled={busy || !available}
            aria-busy={busy}
            className="ui-button ui-button-primary flex-1"
          >
            {busy ? t.adding : t.addToCart}
          </button>
        </div>
      )}
    </section>
  );
}
