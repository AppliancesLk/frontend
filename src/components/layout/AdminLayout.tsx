import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { chatText } from '../../utils/chatText';
import { uiText } from '../../utils/uiText';
import { Icon, type IconName } from '../common/Icon';
import { Dialog } from '../ui/Dialog';
import { useAuth } from '../../hooks/useAuth';
const links: { path: string; label: string; icon: IconName }[] = [
  { path: ROUTES.admin, label: translations.auth.dashboard, icon: 'grid' },
  {
    path: ROUTES.adminProducts,
    label: translations.admin.products,
    icon: 'bag',
  },
  {
    path: ROUTES.adminCategories,
    label: translations.admin.categories,
    icon: 'grid',
  },
  {
    path: ROUTES.adminInventory,
    label: translations.admin.inventory,
    icon: 'appliance',
  },
  {
    path: ROUTES.adminOrders,
    label: translations.adminOrders.title,
    icon: 'orders',
  },
  {
    path: ROUTES.adminRepairs,
    label: translations.adminRepairs.title,
    icon: 'repair',
  },
  { path: ROUTES.adminChat, label: chatText.adminTitle, icon: 'chat' },
  {
    path: ROUTES.adminBanners,
    label: translations.storefront.banners,
    icon: 'laptop',
  },
];
function WorkspaceNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label={translations.auth.adminNavigation} className="space-y-1">
      {links.map((item) => (
        <NavLink
          key={item.path}
          end={item.path === ROUTES.admin}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            'workspace-link flex min-h-12 items-center gap-3 rounded-sm border-l-2 px-4 text-sm font-medium transition-colors ' +
            (isActive
              ? 'is-active border-primary bg-inverse text-primary-on'
              : 'border-transparent text-fg-disabled hover:bg-inverse hover:text-primary-on')
          }
        >
          <Icon name={item.icon} className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState('');
  const [logoutBusy, setLogoutBusy] = useState(false);
  const location = useLocation();
  const current =
    links.find(
      (item) =>
        item.path !== ROUTES.admin && location.pathname.startsWith(item.path),
    ) ?? links[0];
  return (
    <div className="min-h-dvh bg-page lg:flex">
      <a href="#main-content" className="ui-skip">
        {uiText.skip}
      </a>
      <aside className="workspace-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto p-5 lg:flex">
        <Link
          to={ROUTES.home}
          className="px-3 py-5 text-2xl font-bold tracking-tight text-primary-on"
        >
          <BrandLogo inverse />
        </Link>
        <p className="mb-4 mt-6 px-4 text-xs font-semibold tracking-normal text-fg-muted">
          {uiText.workspace}
        </p>
        <WorkspaceNav />
        <Link
          to={ROUTES.home}
          className="mt-auto flex min-h-12 items-center gap-3 border-t border-line-strong px-4 pt-4 text-sm text-fg-disabled hover:text-primary-on"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          {uiText.backToStore}
        </Link>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={uiText.menu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="ui-icon-button -ml-2 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <p className="truncate text-sm font-medium text-fg-secondary">
              {translations.auth.adminWorkspace}
              <span className="mx-3 text-fg-disabled">/</span>
              <span className="text-fg">{current.label}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              to={ROUTES.account}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-fg-link"
              aria-label={translations.storefront.profile}
            >
              {user?.username.slice(0, 2).toUpperCase()}
            </Link>
            <button
              type="button"
              disabled={logoutBusy}
              aria-busy={logoutBusy}
              className="ui-button ui-button-ghost"
              onClick={() => {
                setLogoutBusy(true);
                void signOut()
                  .then(() => navigate(ROUTES.login))
                  .catch(() => setLogoutError(translations.auth.logoutError))
                  .finally(() => setLogoutBusy(false));
              }}
            >
              {logoutBusy
                ? translations.auth.signingOut
                : translations.auth.signOut}
            </button>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-[100rem] px-4 py-6 outline-none sm:px-6 md:py-8 lg:px-8 lg:py-10"
        >
          {logoutError && (
            <p role="alert" className="ui-alert ui-tone-danger mb-4">
              {logoutError}
            </p>
          )}
          <Outlet />
        </main>
      </div>
      <Dialog
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={translations.auth.adminWorkspace}
        drawer
      >
        <div className="-mx-5 -mb-5 workspace-sidebar min-h-[calc(100dvh-6rem)] p-4 sm:-mx-6 sm:-mb-6">
          <WorkspaceNav onNavigate={() => setMenuOpen(false)} />
          <Link
            to={ROUTES.home}
            onClick={() => setMenuOpen(false)}
            className="mt-6 block px-4 py-3 text-sm text-fg-disabled"
          >
            {uiText.backToStore}
          </Link>
        </div>
      </Dialog>
    </div>
  );
}
