import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function SiteHeader() {
  const { user, loading, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function handleLogout() {
    setBusy(true);
    setError('');
    try {
      await signOut();
      navigate(ROUTES.products);
    } catch {
      setError(translations.auth.logoutError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.products}
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          appliances<span className="text-blue-600">.lk</span>
        </Link>
        <nav
          aria-label={translations.auth.mainNavigation}
          className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600"
        >
          <NavLink to={ROUTES.products} className="hover:text-blue-700">
            {translations.auth.shop}
          </NavLink>
          {loading ? (
            <span role="status" className="text-slate-400">
              {translations.auth.checkingAccount}
            </span>
          ) : user ? (
            <>
              {hasRole(USER_ROLES.ADMIN) && (
                <NavLink to={ROUTES.admin} className="hover:text-blue-700">
                  {translations.auth.admin}
                </NavLink>
              )}
              {hasRole(USER_ROLES.REPAIRER) && (
                <NavLink to={ROUTES.repairer} className="hover:text-blue-700">
                  {translations.auth.repairerWorkspace}
                </NavLink>
              )}
              <Link
                to={ROUTES.account}
                className="rounded-lg bg-slate-100 px-3 py-2 text-slate-900"
              >
                {user.username}
              </Link>
              <button
                onClick={() => void handleLogout()}
                disabled={busy}
                className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
              >
                {busy
                  ? translations.auth.signingOut
                  : translations.auth.signOut}
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.login}
                className="px-2 py-2 hover:text-slate-900"
              >
                {translations.auth.signIn}
              </Link>
              <Link
                to={ROUTES.register}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {translations.auth.createAccount}
              </Link>
            </>
          )}
        </nav>
      </div>
      {error && (
        <p
          role="alert"
          className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </header>
  );
}
