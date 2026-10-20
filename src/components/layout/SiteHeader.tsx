import { formatCategoryName } from '../../utils/category';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../../constants/roles';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { useAuth } from '../../hooks/useAuth';
import { getCart } from '../../services/cartService';
import { getCategories } from '../../services/categoryService';
import type { Category } from '../../types/category.types';
import { Icon } from '../common/Icon';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { Spinner } from '../ui/Feedback';
import { Dialog } from '../ui/Dialog';
import { StoreSearch } from './StoreSearch';
import { OfflineBanner } from '../feedback/OfflineBanner';

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [noticeHeight, setNoticeHeight] = useState(0);
  const notices = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
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
  const customer = !user || user.role === USER_ROLES.CUSTOMER;
  const checkout = location.pathname === ROUTES.checkout;
  const home = location.pathname === ROUTES.home;
  const repairRoute =
    user?.role === 'ADMIN'
      ? ROUTES.adminRepairs
      : user?.role === 'REPAIRER'
        ? ROUTES.repairerRepairs
        : ROUTES.repairRequest;
  const supportRoute =
    user?.role === 'ADMIN'
      ? ROUTES.adminChat
      : user?.role === 'REPAIRER'
        ? ROUTES.repairerRepairs
        : ROUTES.liveChat;
  const count = user && cart?.userId === user.id ? cart.count : 0;
  useEffect(() => {
    let active = true;
    void getCategories()
      .then((items) => {
        if (active)
          setCategories(items.filter((item) => item.isActive && !item.parent));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const scrollPosition = () =>
      Math.max(
        0,
        Math.min(
          window.scrollY,
          document.documentElement.scrollHeight - window.innerHeight,
        ),
      );
    let previous = scrollPosition();
    let turnPosition = previous;
    let direction = 0;
    let hidden = false;
    let frame = 0;
    const show = (hide: boolean) => {
      if (hidden === hide) return;
      hidden = hide;
      setCollapsed(hide);
    };
    const update = () => {
      frame = 0;
      const next = scrollPosition();
      const delta = next - previous;
      // Ignore tiny reversals and overscroll bounce. Keep keyboard navigation visible.
      if (
        next <= 72 ||
        !window.matchMedia('(min-width: 768px)').matches ||
        (navigation.current?.contains(document.activeElement) &&
          document.activeElement?.matches(':focus-visible'))
      ) {
        show(false);
        turnPosition = previous = next;
        direction = 0;
        return;
      }
      if (delta === 0) return;
      const nextDirection = delta > 0 ? 1 : -1;
      if (nextDirection !== direction) {
        turnPosition = previous;
        direction = nextDirection;
      }
      previous = next;
      if (direction === 1 && next > 120 && next - turnPosition >= 32)
        show(true);
      else if (direction === -1 && turnPosition - next >= 16) show(false);
    };
    const scroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resize = () => {
      show(false);
      turnPosition = previous = scrollPosition();
      direction = 0;
    };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    if (!notices.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setNoticeHeight(entry.contentRect.height),
    );
    observer.observe(notices.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      document
        .querySelectorAll<HTMLDetailsElement>('.header-menu[open]')
        .forEach((menu) => {
          if (!menu.contains(event.target as Node)) menu.open = false;
        });
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return (
    <>
      <a href="#main-content" className="ui-skip">
        Skip to main content
      </a>
      <div
        className={`site-header-slot ${checkout ? 'is-checkout' : ''} ${home ? 'is-home' : ''}`}
        style={{ paddingBottom: noticeHeight }}
      >
        <header
          className={`site-header ${collapsed ? 'is-collapsed' : ''} ${checkout ? 'checkout-header' : ''}`}
        >
          <div className="header-main shell-wide">
            <Link
              to={ROUTES.home}
              aria-label="Appliances.lk home"
              className="shrink-0"
            >
              <BrandLogo />
            </Link>
            {checkout ? (
              <>
                <span className="ml-auto flex items-center gap-2 text-sm text-fg-secondary">
                  <Icon name="lock" />
                  Secure checkout
                </span>
                <Link
                  to={ROUTES.cart}
                  className="hidden text-sm text-fg-link sm:block"
                >
                  Back to cart
                </Link>
              </>
            ) : (
              <>
                <div className="desktop-search">
                  <StoreSearch key={location.search} />
                </div>
                <div className="header-actions">
                  <Link to={supportRoute} className="header-help">
                    <Icon name="chat" />
                    <span>Help</span>
                  </Link>
                  <button
                    className="ui-icon-button md:hidden"
                    aria-label="Open search"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Icon name="search" />
                  </button>
                  {!user && !loading && (
                    <div className="hidden items-center gap-3 md:flex">
                      <Link
                        to={ROUTES.login}
                        className="ui-button ui-button-secondary min-h-10 whitespace-nowrap"
                      >
                        Sign in
                      </Link>
                      <Link
                        to={ROUTES.register}
                        className="hidden min-h-10 items-center whitespace-nowrap text-sm text-fg-link xl:inline-flex"
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                  <details
                    key={location.pathname}
                    className={`header-menu account-menu ${!user ? 'hidden' : ''}`}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape')
                        event.currentTarget.open = false;
                    }}
                  >
                    <summary className="account-trigger">
                      <span className="account-avatar">
                        {user ? (
                          user.username.slice(0, 1).toUpperCase()
                        ) : (
                          <Icon name="user" className="h-4 w-4" />
                        )}
                      </span>
                      <span className="hidden max-w-28 truncate lg:block">
                        {loading ? 'Loading…' : (user?.username ?? 'Sign in')}
                      </span>
                      <span className="hidden text-xs lg:block">⌄</span>
                    </summary>
                    <div className="header-popover">
                      {user ? (
                        <>
                          <p className="border-b border-line-subtle px-3 py-3 text-sm font-semibold">
                            {user.username}
                          </p>
                          <Link to={ROUTES.account}>Your account</Link>
                          {customer && (
                            <>
                              <Link to={ROUTES.orders}>Your orders</Link>
                              <Link to={ROUTES.repairs}>Your repairs</Link>
                              <Link to={ROUTES.liveChat}>Live support</Link>
                            </>
                          )}
                          {user.role === 'ADMIN' && (
                            <Link to={ROUTES.admin}>Admin workspace</Link>
                          )}
                          {user.role === 'REPAIRER' && (
                            <Link to={ROUTES.repairer}>Repair workspace</Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Link to={ROUTES.login}>Sign in</Link>
                          <Link to={ROUTES.register}>Create account</Link>
                        </>
                      )}
                      <div className="border-t border-line-subtle px-2 py-3">
                        <p className="mb-2 px-1 text-xs text-fg-muted">
                          Appearance
                        </p>
                        <ThemeToggle />
                      </div>
                      {user && (
                        <button
                          disabled={busy}
                          onClick={() => void logout()}
                          className="w-full text-danger"
                        >
                          {busy && <Spinner />}
                          {busy ? 'Signing out…' : 'Sign out'}
                        </button>
                      )}
                    </div>
                  </details>
                  {customer && (
                    <Link
                      to={ROUTES.cart}
                      aria-label={`Cart${count ? `, ${count} items` : ''}`}
                      className="header-cart"
                    >
                      <span className="relative">
                        <Icon name="cart" className="h-6 w-6" />
                        {count > 0 && (
                          <span key={count} className="cart-count">
                            {count > 99 ? '99+' : count}
                          </span>
                        )}
                      </span>
                      <span className="hidden text-sm lg:inline">Cart</span>
                      <span className="sr-only" aria-live="polite">
                        {count} items in cart
                      </span>
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
          {!checkout && (
            <>
              {home && (
                <div className="home-mobile-search shell-wide">
                  <StoreSearch />
                </div>
              )}
              <nav
                ref={navigation}
                inert={collapsed}
                aria-label={translations.auth.mainNavigation}
                className="header-navigation"
              >
                <div className="shell-wide flex items-center gap-7">
                  <details
                    className="header-menu category-menu"
                    onKeyDown={(event) => {
                      if (event.key === 'Escape')
                        event.currentTarget.open = false;
                    }}
                  >
                    <summary className="shop-all">
                      <Icon name="grid" className="h-4 w-4" />
                      Shop all<span className="ml-2 text-xs">⌄</span>
                    </summary>
                    <div className="header-popover category-popover">
                      <Link to={ROUTES.products}>All products</Link>
                      {categories.map((category) => (
                        <Link
                          key={category.categoryID}
                          to={`${ROUTES.products}?category=${encodeURIComponent(category.categoryID)}`}
                          onClick={(event) => {
                            const menu = event.currentTarget.closest('details');
                            if (menu) menu.open = false;
                          }}
                        >
                          {formatCategoryName(category.name)}
                        </Link>
                      ))}
                    </div>
                  </details>
                  <div className="category-nav-links">
                    {categories.slice(0, 5).map((category) => (
                      <Link
                        key={category.categoryID}
                        to={`${ROUTES.products}?category=${encodeURIComponent(category.categoryID)}`}
                      >
                        {formatCategoryName(category.name)}
                      </Link>
                    ))}
                  </div>
                  <div className="service-nav-links">
                    <NavLink to={repairRoute}>
                      <Icon name="repair" className="h-4 w-4" />
                      {customer ? 'Repair a device' : 'Repairs'}
                    </NavLink>
                    {customer && (
                      <>
                        <NavLink to={ROUTES.orders}>Your orders</NavLink>
                        <NavLink to={ROUTES.liveChat}>Live support</NavLink>
                      </>
                    )}
                  </div>
                </div>
              </nav>
            </>
          )}
          <div ref={notices}>
            {error && (
              <p
                role="alert"
                className="bg-danger-bg px-4 py-2 text-sm text-danger"
              >
                {error}
              </p>
            )}
            <OfflineBanner />
          </div>
        </header>
      </div>
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search products"
      >
        <StoreSearch autoFocus onSearch={() => setSearchOpen(false)} />
      </Dialog>
    </>
  );
}
