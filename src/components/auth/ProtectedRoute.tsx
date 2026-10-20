import { LoadingState } from '../ui/Feedback';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth.types';

export function ProtectedRoute({
  roles,
  children,
}: {
  roles?: UserRole[];
  children?: ReactNode;
}) {
  const { user, loading, error, refresh } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <LoadingState label={translations.auth.checkingSession} compact={true} />
    );
  if (error)
    return (
      <div role="alert" className="mx-auto max-w-xl p-10">
        <p>{error}</p>
        <button className="auth-primary mt-4" onClick={() => void refresh()}>
          {translations.common.retry}
        </button>
      </div>
    );
  if (!user)
    return (
      <Navigate
        to={ROUTES.login}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  if (roles && !roles.includes(user.role))
    return <Navigate to={ROUTES.forbidden} replace />;
  return children ?? <Outlet />;
}
