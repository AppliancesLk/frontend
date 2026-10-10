import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { useAuth } from '../../hooks/useAuth';
import { getCart } from '../../services/cartService';
import { Icon } from '../common/Icon';
import { chatText } from '../../utils/chatText';
const t = translations.storefront;

export function SiteHeader() {
  const { user, loading, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<{ userId: string; count: number } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user || user.role !== USER_ROLES.CUSTOMER) return;
    let active = true;
    let revision = 0;
    const refresh = () => {
      const current = ++revision;
      void getCart()
        .then((result) => {
          if (active && current === revision)
            setCart({ userId: user.id, count: result.itemCount });
        })
        .catch(() => {
          if (active && current === revision) setCart(null);
        });
    };
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => {
      active = false;
      window.removeEventListener('cart-updated', refresh);
    };
  }, [user, location.pathname]);
  async function logout() {
    setBusy(true);
    setError('');
    try {
      await signOut();
      navigate(ROUTES.home);
    } catch {
      setError(translations.auth.logoutError);
    } finally {
      setBusy(false);
    }
  }
  const links = [
    { path: ROUTES.home, label: t.home, icon: 'home' },
    { path: ROUTES.cart, label: t.cart, icon: 'cart' },
    { path: ROUTES.orders, label: t.orders, icon: 'orders' },
    { path: ROUTES.repairRequest, label: t.repairs, icon: 'repair' },
  ] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="h-1 bg-yellow-400" />
      <div className="mx-auto flex max-w-[96rem] flex-wrap items-center gap-4 lg:flex-nowrap lg:gap-3 xl:gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="shrink-0 text-2xl font-bold lg:text-xl xl:text-2xl tracking-tight text-slate-900"
        >
          appliances<span className="text-blue-600">.lk</span>
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-yellow-400" />
        </Link>
        <form
          role="search"
          className="order-3 flex w-full items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-blue-500 sm:order-none sm:min-w-48 sm:flex-1 lg:min-w-32"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(
              `${ROUTES.products}?q=${encodeURIComponent(query.trim())}`,
            );
          }}
        >
          <label htmlFor="store-search" className="sr-only">
            {t.searchLabel}
          </label>
          <input
            id="store-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
          />
          <button
            aria-label={t.searchLabel}
            className="m-1 rounded-md bg-yellow-400 p-2 text-slate-900 hover:bg-yellow-300"
          >
            <Icon name="search" />
          </button>
        </form>
        <nav
          aria-label={translations.auth.mainNavigation}
          className="order-4 w-full border-t border-slate-100 pt-2 lg:order-none lg:w-auto lg:shrink-0 lg:border-0 lg:pt-0"
        >
          <div className="flex items-center justify-between gap-1 sm:justify-start sm:gap-4 lg:gap-0 xl:gap-1">
            {links
              .filter(
                (link) =>
                  link.icon === 'home' ||
                  !user ||
                  user.role === USER_ROLES.CUSTOMER,
              )
              .map((link) => (
                <NavLink
                  key={link.path}
                  end={link.path === ROUTES.home}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative flex min-h-12 items-center gap-1.5 border-b-2 px-1.5 text-xs font-medium sm:gap-2 sm:px-3 sm:text-sm lg:px-2 lg:text-xs xl:text-sm ${isActive ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-blue-700'}`
                  }
                >
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                  {link.icon === 'cart' &&
                    user &&
                    cart?.userId === user.id &&
                    cart.count > 0 && (
                      <span className="rounded-full bg-yellow-400 px-1.5 text-xs font-bold text-slate-900">
                        {cart.count}
                      </span>
                    )}
                </NavLink>
              ))}
            <Link
              to={ROUTES.products}
              className="ml-auto hidden text-sm font-medium text-blue-700 sm:block lg:hidden"
            >
              {t.shop} →
            </Link>
          </div>
        </nav>
        <div className="order-2 ml-auto shrink-0 text-sm lg:ml-0">
          <details key={location.pathname} className="relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-3 hover:bg-blue-50">
              <Icon name="user" />
              <span className="max-w-28 truncate lg:max-w-20 xl:max-w-28">
                {loading ? t.loading : (user?.username ?? t.profile)}
              </span>
            </summary>
            <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {user ? (
                <>
                  <Link
                    className="block rounded-lg p-3 hover:bg-slate-50"
                    to={ROUTES.account}
                  >
                    {t.profile}
                  </Link>
                  {hasRole(USER_ROLES.CUSTOMER) && <Link className="block rounded-lg p-3 hover:bg-slate-50" to={ROUTES.liveChat}>{chatText.title}</Link>}
                  {hasRole(USER_ROLES.ADMIN) && (
                    <Link
                      className="block rounded-lg p-3 hover:bg-slate-50"
                      to={ROUTES.admin}
                    >
                      {translations.auth.admin}
                    </Link>
                  )}
                  {hasRole(USER_ROLES.REPAIRER) && (
                    <Link
                      className="block rounded-lg p-3 hover:bg-slate-50"
                      to={ROUTES.repairer}
                    >
                      {translations.auth.repairerWorkspace}
                    </Link>
                  )}
                  <button
                    disabled={busy}
                    className="w-full rounded-lg p-3 text-left hover:bg-slate-50 disabled:opacity-50"
                    onClick={() => void logout()}
                  >
                    {busy
                      ? translations.auth.signingOut
                      : translations.auth.signOut}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    className="block rounded-lg p-3 hover:bg-slate-50"
                    to={ROUTES.login}
                  >
                    {translations.auth.signIn}
                  </Link>
                  <Link
                    className="block rounded-lg bg-blue-600 p-3 text-white"
                    to={ROUTES.register}
                  >
                    {translations.auth.createAccount}
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>

      {error && (
        <p role="alert" className="px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </header>
  );
}
