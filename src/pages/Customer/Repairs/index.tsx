import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';

const t = translations.repairs;

export default function RepairsPage() {
  const { user } = useAuth();
  return user ? <RepairsContent key={user.id} /> : null;
}

function RepairsContent() {
  useEffect(() => {
    const previous = document.title;
    document.title = `${t.title} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label={translations.productDetails.breadcrumb}
          className="text-sm"
        >
          <ol className="flex items-center gap-2 text-slate-500">
            <li>
              <Link
                to={ROUTES.products}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {translations.productDetails.products}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.title}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{t.description}</p>
          </div>
          <Link to={ROUTES.repairRequest} className="auth-primary">
            {t.requestTitle}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Repair tracking functionality will be implemented here.
          </p>
          <Link
            to={ROUTES.repairRequest}
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t.requestTitle}
          </Link>
        </div>
      </div>
    </main>
  );
}
