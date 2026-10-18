import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { translations } from '../../utils/translations';
const t = translations.storefront;
export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            to={ROUTES.home}
            className="text-2xl font-bold tracking-tight text-white"
          >
            appliances<span className="text-yellow-400">.lk</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7">
            {t.footerDescription}
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{t.quickLinks}</h2>
          <ul className="space-y-3 text-sm">
            {[
              [ROUTES.home, t.home],
              [ROUTES.products, t.shop],
              [ROUTES.repairRequest, t.repairs],
            ].map(([path, label]) => (
              <li key={path}>
                <Link className="hover:text-yellow-300" to={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{t.account}</h2>
          <ul className="space-y-3 text-sm">
            {[
              [ROUTES.account, t.profile],
              [ROUTES.orders, t.orders],
              [ROUTES.cart, t.cart],
            ].map(([path, label]) => (
              <li key={path}>
                <Link className="hover:text-yellow-300" to={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-semibold text-white">{t.contact}</h2>
          <p className="text-sm leading-7">
            {t.location}
            <br />
            {t.contactPlaceholder}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Appliances.lk. {t.rights}
      </div>
    </footer>
  );
}
