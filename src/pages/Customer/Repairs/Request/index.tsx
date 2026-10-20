import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { useRepairRequest } from './hooks/useRepairRequest';
import { RepairRequestForm } from './components/RepairRequestForm';
import { RepairSuccess } from './components/RepairSuccess';

const t = translations.repairs;

export default function RepairRequestPage() {
  const { user } = useAuth();
  return user ? <RepairRequestContent key={user.id} /> : null;
}

function RepairRequestContent() {
  const page = useRepairRequest();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t.requestTitle} | ${translations.common.storeName}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
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
            <li>
              <Link
                to={ROUTES.repairs}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {t.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t.requestTitle}</li>
          </ol>
        </nav>

        <div>
          <h1 className="ui-page-title text-slate-900">{t.requestTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.requestDescription}</p>
        </div>

        {page.createdTicket ? (
          <RepairSuccess ticket={page.createdTicket} />
        ) : (
          <RepairRequestForm page={page} />
        )}
      </div>
    </main>
  );
}
