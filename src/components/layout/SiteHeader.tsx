import { Spinner } from '../ui/Feedback';
import { Dialog } from '../ui/Dialog';
import { Tooltip } from '../ui/Tooltip';
import { uiText } from '../../utils/uiText';
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    {
      path: ROUTES.products,
      label: translations.productDetails.products,
      icon: 'grid',
    },
    ...(!user || user.role === USER_ROLES.CUSTOMER
      ? ([
          { path: ROUTES.repairRequest, label: t.repairs, icon: 'repair' },
          { path: ROUTES.orders, label: t.orders, icon: 'orders' },
          { path: ROUTES.liveChat, label: chatText.title, icon: 'chat' },
        ] as const)
      : []),
    ...(user?.role === USER_ROLES.REPAIRER
      ? [
          {
            path: ROUTES.repairerRepairs,
            label: uiText.assignedRepairs,
            icon: 'repair' as const,
          },
        ]
      : []),
  ] as const;
  const accountLinks = user
    ? [
        { path: ROUTES.account, label: t.profile },
        ...(hasRole(USER_ROLES.CUSTOMER)
          ? [{ path: ROUTES.liveChat, label: chatText.title }]
          : []),
        ...(hasRole(USER_ROLES.ADMIN)
          ? [{ path: ROUTES.admin, label: translations.auth.admin }]
          : []),
        ...(hasRole(USER_ROLES.REPAIRER)
          ? [
              {
                path: ROUTES.repairer,
                label: translations.auth.repairerWorkspace,
              },
            ]
          : []),
      ]
    : [
        { path: ROUTES.login, label: translations.auth.signIn },
        { path: ROUTES.register, label: translations.auth.createAccount },
      ];
  return (
    <>
      <a href="#main-content" className="ui-skip">
        {uiText.skip}
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8 lg:py-5">
          <button
            type="button"
            aria-label={uiText.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="ui-icon-button -ml-2 lg:hidden"
          >
            <Icon name="menu" />
          </button>
          <Link
            to={ROUTES.home}
            className="shrink-0 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl"
          >
            appliances<span className="text-blue-600">.lk</span>
          </Link>
          <form
            role="search"
            className="order-last mt-2 flex w-full min-w-0 items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 lg:order-none lg:mx-6 lg:mt-0 lg:w-auto lg:flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(
                ROUTES.products + '?q=' + encodeURIComponent(query.trim()),
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
              className="ui-icon-button mr-1 text-blue-700"
            >
              <Icon name="search" />
            </button>
          </form>
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            {(!user || user.role === USER_ROLES.CUSTOMER) && (
              <Tooltip label={t.cart}>
                <Link
                  to={ROUTES.cart}
                  aria-label={t.cart}
                  className="ui-icon-button relative"
                >
                  <Icon name="cart" />
                  {user && cart?.userId === user.id && cart.count > 0 && (
                    <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
                      {cart.count}
                    </span>
                  )}
                </Link>
              </Tooltip>
            )}
            <details
              key={location.pathname}
              className="relative"
              onKeyDown={(event) => {
                if (event.key === 'Escape') event.currentTarget.open = false;
              }}
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-2 text-sm text-slate-700 hover:bg-slate-50 sm:px-3">
                <Icon name="user" />
                <span className="hidden max-w-28 truncate sm:block">
                  {loading ? t.loading : (user?.username ?? t.profile)}
                </span>
                <span className="sr-only sm:hidden">{t.profile}</span>
              </summary>
              <div className="absolute right-0 z-40 mt-3 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {accountLinks.map((link) => (
                  <Link
                    key={link.path}
                    className="block rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    to={link.path}
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <button
                    disabled={busy}
                    className="ui-button ui-button-secondary mt-1 w-full rounded-lg border-t border-slate-100 px-3 py-3 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    onClick={() => void logout()}
                  >
                    {busy && <Spinner className="mr-2" />}
                    {busy
                      ? translations.auth.signingOut
                      : translations.auth.signOut}
                  </button>
                )}
              </div>
            </details>
          </div>
        </div>
        <nav
          aria-label={translations.auth.mainNavigation}
          className="hidden border-t border-slate-100 lg:block"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-8">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  'flex min-h-12 items-center gap-2 border-b-2 text-sm font-medium ' +
                  (isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-blue-700')
                }
              >
                <Icon name={link.icon} className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
        {error && (
          <p role="alert" className="bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </header>
      <Dialog
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={uiText.navigation}
        drawer
      >
        <nav aria-label={uiText.navigation} className="space-y-1">
          {[
            { path: ROUTES.home, label: t.home, icon: 'home' as const },
            ...links,
          ].map((link) => (
            <NavLink
              key={link.path}
              end={link.path === ROUTES.home}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                'flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium ' +
                (isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50')
              }
            >
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Dialog>
    </>
  );
}
