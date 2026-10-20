import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
import { uiText } from '../../utils/uiText';
import { useAuth } from '../../hooks/useAuth';
const t = translations.storefront;
export function SiteFooter() {
  const { user } = useAuth();
  const customer = !user || user.role === 'CUSTOMER';
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
  const supportLabel =
    user?.role === 'REPAIRER' ? uiText.assignedRepairs : uiText.support;
  const repairLabel =
    user?.role === 'ADMIN'
      ? translations.adminRepairs.title
      : user?.role === 'REPAIRER'
        ? uiText.assignedRepairs
        : t.repairs;
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1.5fr] lg:px-8">
        <div>
          <Link
            to={ROUTES.home}
            className="text-2xl font-bold tracking-tight text-white"
          >
            appliances<span className="text-blue-300">.lk</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7">
            {t.footerDescription}
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{t.quickLinks}</h2>
          <ul className="space-y-1 text-sm">
            {[
              [ROUTES.home, t.home],
              [ROUTES.products, t.shop],
              [repairRoute, repairLabel],
            ].map(([path, label]) => (
              <li key={path}>
                <Link
                  className="inline-flex min-h-10 items-center hover:text-blue-200"
                  to={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{t.account}</h2>
          <ul className="space-y-1 text-sm">
            {[
              [ROUTES.account, t.profile],
              ...(customer
                ? [
                    [ROUTES.orders, t.orders],
                    [ROUTES.cart, t.cart],
                  ]
                : [
                    [
                      user?.role === 'ADMIN' ? ROUTES.admin : ROUTES.repairer,
                      user?.role === 'ADMIN'
                        ? translations.auth.adminWorkspace
                        : translations.auth.repairerWorkspace,
                    ],
                  ]),
            ].map(([path, label]) => (
              <li key={path}>
                <Link
                  className="inline-flex min-h-10 items-center hover:text-blue-200"
                  to={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{supportLabel}</h2>
          <p className="text-sm leading-7">
            {user?.role === 'REPAIRER'
              ? uiText.repairerDescription
              : uiText.supportDescription}
          </p>
          <Link
            to={supportRoute}
            className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-blue-300 hover:text-white"
          >
            {supportLabel} &rarr;
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Appliances.lk. {t.rights}
      </div>
    </footer>
  );
}
