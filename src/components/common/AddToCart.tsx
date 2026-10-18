import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { addCartItem } from '../../services/cartService';
import { getApiError } from '../../utils/apiErrors';
import { translations } from '../../utils/translations';
import { Icon } from './Icon';
const t = translations.cart;
export function AddToCart({
  productId,
  available,
  compact = false,
  productName = '',
}: {
  productId: string;
  available: boolean;
  compact?: boolean;
  productName?: string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  async function add() {
    if (busy.current || !available) return;
    busy.current = true;
    setSaving(true);
    setError('');
    setAdded(false);
    try {
      await addCartItem({ productId, quantity: 1 });
      setAdded(true);
    } catch (err: unknown) {
      setError(getApiError(err, t.addError));
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  if (loading || (user && user.role !== USER_ROLES.CUSTOMER)) return null;
  return (
    <div className={compact ? 'space-y-2' : 'mb-5 space-y-3'}>
      {compact && !available ? (
        <button
          disabled
          aria-label={translations.productDetails.outOfStock}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
        >
          <Icon name="cart" />
        </button>
      ) : !user ? (
        <Link
          to={ROUTES.login}
          state={{ from: location.pathname + location.search }}
          aria-label={compact ? `${t.signInToAdd}: ${productName}` : undefined}
          className={
            compact
              ? 'flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700'
              : 'auth-primary w-full'
          }
        >
          {compact ? <Icon name="cart" /> : t.signInToAdd}
        </Link>
      ) : (
        <button
          type="button"
          disabled={!available || saving}
          onClick={() => void add()}
          aria-label={
            compact ? `${saving ? t.adding : t.add}: ${productName}` : undefined
          }
          className={
            compact
              ? 'flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              : 'auth-primary w-full'
          }
        >
          {compact ? (
            <Icon name={added ? 'check' : 'cart'} />
          ) : saving ? (
            t.adding
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
              ? 'max-w-40 rounded-lg bg-red-50 p-2 text-xs text-red-800'
              : 'rounded-lg bg-red-50 p-3 text-sm text-red-800'
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
              : 'rounded-lg bg-green-50 p-3 text-sm text-green-800'
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
