import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { Icon, type IconName } from '../common/Icon';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { SeasonalGreeting } from '../seasonal/SeasonalGreeting';
export function CustomerLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const hideTabs = [
    ROUTES.checkout,
    ROUTES.cart,
    ROUTES.liveChat,
    ROUTES.repairRequest,
  ].some((path) => pathname.startsWith(path));
  const tabs: { path: string; label: string; icon: IconName }[] = [
    { path: ROUTES.home, label: 'Home', icon: 'home' },
    { path: ROUTES.products, label: 'Shop', icon: 'bag' },
    {
      path:
        user?.role === 'REPAIRER'
          ? ROUTES.repairerRepairs
          : user?.role === 'ADMIN'
            ? ROUTES.adminRepairs
            : ROUTES.repairs,
      label: 'Repairs',
      icon: 'repair',
    },
    {
      path:
        user?.role === 'ADMIN'
          ? ROUTES.adminOrders
          : user?.role === 'REPAIRER'
            ? ROUTES.repairer
            : ROUTES.orders,
      label: user?.role === 'REPAIRER' ? 'Workspace' : 'Orders',
      icon: user?.role === 'REPAIRER' ? 'grid' : 'orders',
    },
    {
      path: user ? ROUTES.account : ROUTES.login,
      label: 'Account',
      icon: 'user',
    },
  ];
  return (
    <div
      className={`store-layout flex min-h-screen flex-col bg-page ${hideTabs ? 'without-bottom-tabs' : 'with-bottom-tabs'}`}
    >
      <SiteHeader />
      <SeasonalGreeting compact={pathname !== ROUTES.home} />
      <div
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 outline-none"
      >
        <Outlet />
      </div>
      <SiteFooter />
      {!hideTabs && (
        <nav className="mobile-tabs" aria-label="Mobile navigation">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === ROUTES.home}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              <Icon name={tab.icon} className="h-6 w-6" />
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
