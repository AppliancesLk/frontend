import { NavLink, Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="bg-slate-900 p-5 text-slate-300 md:w-60 md:shrink-0">
        <p className="mb-5 text-sm font-semibold text-white">
          {translations.auth.adminWorkspace}
        </p>
        <nav aria-label={translations.auth.adminNavigation}>
          {[
            { path: ROUTES.admin, label: translations.auth.dashboard },
            { path: ROUTES.adminProducts, label: translations.admin.products },
            {
              path: ROUTES.adminCategories,
              label: translations.admin.categories,
            },
            {
              path: ROUTES.adminInventory,
              label: translations.admin.inventory,
            },
            { path: ROUTES.adminOrders, label: translations.adminOrders.title },
          ].map((item) => (
            <NavLink
              key={item.path}
              end={item.path === ROUTES.admin}
              to={item.path}
              className={({ isActive }) =>
                `mb-1 block rounded-lg border-l-2 px-4 py-3 text-sm font-medium ${isActive ? 'border-blue-500 bg-slate-800 text-white' : 'border-transparent hover:bg-slate-800'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <SiteHeader />
        <main className="px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
