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
            'flex min-h-12 items-center gap-3 rounded-lg border-l-2 px-4 text-sm font-medium transition-colors ' +
            (isActive
              ? 'border-blue-400 bg-slate-800 text-white'
              : 'border-transparent text-slate-300 hover:bg-slate-800 hover:text-white')
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
  const location = useLocation();
  const current =
    links.find(
      (item) =>
        item.path !== ROUTES.admin && location.pathname.startsWith(item.path),
    ) ?? links[0];
  return (
    <div className="min-h-dvh bg-slate-50 lg:flex">
      <a href="#main-content" className="ui-skip">
        {uiText.skip}
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto bg-slate-900 p-5 lg:flex">
        <Link
          to={ROUTES.home}
          className="px-3 py-5 text-2xl font-bold tracking-tight text-white"
        >
          appliances<span className="text-blue-300">.lk</span>
        </Link>
        <p className="mb-4 mt-6 px-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          {uiText.workspace}
        </p>
        <WorkspaceNav />
        <Link
          to={ROUTES.home}
          className="mt-auto flex min-h-12 items-center gap-3 border-t border-slate-700 px-4 pt-4 text-sm text-slate-300 hover:text-white"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          {uiText.backToStore}
        </Link>
      </aside>
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
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
            <p className="truncate text-sm font-medium text-slate-600">
              {translations.auth.adminWorkspace}
              <span className="mx-3 text-slate-300">/</span>
              <span className="text-slate-900">{current.label}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={ROUTES.account}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-800"
              aria-label={translations.storefront.profile}
            >
              {user?.username.slice(0, 2).toUpperCase()}
            </Link>
            <button
              type="button"
              className="ui-button ui-button-ghost"
              onClick={() => {
                void signOut()
                  .then(() => navigate(ROUTES.login))
                  .catch(() => setLogoutError(translations.auth.logoutError));
              }}
            >
              {translations.auth.signOut}
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
        <div className="-mx-5 -mb-5 min-h-[calc(100dvh-6rem)] bg-slate-900 p-4 sm:-mx-6 sm:-mb-6">
          <WorkspaceNav onNavigate={() => setMenuOpen(false)} />
          <Link
            to={ROUTES.home}
            onClick={() => setMenuOpen(false)}
            className="mt-6 block px-4 py-3 text-sm text-slate-300"
          >
            {uiText.backToStore}
          </Link>
        </div>
      </Dialog>
    </div>
  );
}
