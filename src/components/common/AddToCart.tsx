import { useEffect, useRef, useState } from 'react';
import { notifyToast } from '../../utils/toast';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { addCartItem } from '../../services/cartService';
import { getApiError } from '../../utils/apiErrors';
import { translations } from '../../utils/translations';
import { Icon } from './Icon';
import { Spinner } from '../ui/Feedback';
const t = translations.cart;
export function AddToCart({
  productId,
  available,
  compact = false,
  card = false,
  productName = '',
}: {
  productId: string;
  available: boolean;
  compact?: boolean;
  card?: boolean;
  productName?: string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);
  async function add() {
    if (busy.current || !available) return;
    busy.current = true;
    setSaving(true);
    setError('');
    setAdded(false);
    try {
      await addCartItem({ productId, quantity: 1 });
      setAdded(true);
      notifyToast({
        message: translations.storefront.added,
        action: { label: t.view, to: ROUTES.cart },
      });
    } catch (err: unknown) {
      setError(getApiError(err, t.addError));
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  if (loading || (user && user.role !== USER_ROLES.CUSTOMER)) return null;
  return (
    <div
      className={
        card
          ? 'mt-3 w-full space-y-2'
          : compact
            ? 'space-y-2'
            : 'mb-5 space-y-3'
      }
    >
      {compact && !available ? (
        <button
          disabled
          aria-label={translations.productDetails.outOfStock}
          className="flex min-h-11 w-11 items-center justify-center rounded-sm bg-subtle text-fg-muted"
        >
          <Icon name="cart" />
        </button>
      ) : !user ? (
        <Link
          to={ROUTES.login}
          state={{ from: location.pathname + location.search }}
          aria-label={compact ? `${t.signInToAdd}: ${productName}` : undefined}
          className={
            card
              ? 'ui-button ui-button-secondary w-full'
              : compact
                ? 'flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-primary-on hover:bg-primary-hover'
                : 'auth-primary w-full'
          }
        >
          {card ? (
            <>
              <Icon name="cart" className="h-4 w-4" />
              {t.add}
            </>
          ) : compact ? (
            <Icon name="cart" />
          ) : (
            t.signInToAdd
          )}
        </Link>
      ) : (
        <button
          type="button"
          disabled={!available || saving}
          aria-busy={saving}
          onClick={() => void add()}
          aria-label={
            compact ? `${saving ? t.adding : t.add}: ${productName}` : undefined
          }
          className={
            card
              ? 'ui-button ui-button-secondary w-full'
              : compact
                ? 'flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-on hover:bg-primary-hover '
                : 'auth-primary w-full'
          }
        >
          {card ? (
            <>
              {saving ? (
                <Spinner />
              ) : (
                <Icon name={added ? 'check' : 'cart'} className="h-4 w-4" />
              )}
              {saving ? t.adding : added ? 'Added' : t.add}
            </>
          ) : compact ? (
            saving ? (
              <Spinner />
            ) : (
              <Icon name={added ? 'check' : 'cart'} />
            )
          ) : saving ? (
            <>
              <Spinner />
              {t.adding}
            </>
          ) : available ? (
            t.add
          ) : (
            translations.productDetails.outOfStock
          )}
        </button>
      )}
      {error && (
        <p
          role="alert"
          className={
            compact
              ? 'max-w-40 rounded-sm bg-danger-bg p-2 text-xs text-danger'
              : 'rounded-sm bg-danger-bg p-3 text-sm text-danger'
          }
        >
          {error}
        </p>
      )}
      {added && (
        <p
          role="status"
          className={
            compact
              ? 'sr-only'
              : 'rounded-sm bg-success-bg p-3 text-sm text-success'
          }
        >
          {t.added}{' '}
          {!compact && (
            <Link
              to={ROUTES.cart}
              className="font-semibold underline underline-offset-4"
            >
              {t.view}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
