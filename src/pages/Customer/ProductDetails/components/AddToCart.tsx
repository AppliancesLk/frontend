import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { USER_ROLES } from '../../../../constants/roles';
import { ROUTES } from '../../../../constants/routes';
import { addCartItem } from '../../../../services/cartService';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';
const t = translations.cart;
export function AddToCart({
  productId,
  available,
}: {
  productId: string;
  available: boolean;
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
    <div className="mb-5 space-y-3">
      {!user ? (
        <Link
          to={ROUTES.login}
          state={{ from: location.pathname }}
          className="auth-primary w-full"
        >
          {t.signInToAdd}
        </Link>
      ) : (
        <button
          type="button"
          disabled={!available || saving}
          onClick={() => void add()}
          className="auth-primary w-full"
        >
          {saving
            ? t.adding
            : available
              ? t.add
              : translations.productDetails.outOfStock}
        </button>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {added && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {t.added}{' '}
          <Link
            to={ROUTES.cart}
            className="font-semibold underline underline-offset-4"
          >
            {t.view}
          </Link>
        </p>
      )}
    </div>
  );
}
