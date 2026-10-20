import { LoadingState } from '../../../../components/ui/Feedback';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { AdminOrderDetails } from '../components/AdminOrderDetails';
import { useAdminOrdersPage } from '../hooks/useAdminOrdersPage';

const t = translations.adminOrders;
export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const page = useAdminOrdersPage(id);
  return (
    <section className="space-y-6">
      <Link
        to={ROUTES.adminOrders}
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        &larr; {t.back}
      </Link>
      <header>
        <h1 className="ui-page-title text-slate-900">{t.detailsTitle}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.description}</p>
      </header>
      {page.loading && <LoadingState label={t.loading} compact={false} />}
      {page.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          <p>{page.error}</p>
          <button
            type="button"
            onClick={page.refresh}
            className="auth-secondary mt-4"
          >
            {translations.common.retry}
          </button>
        </div>
      )}
      {page.notFound && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">{t.notFound}</h2>
          <p className="mt-2 text-sm text-slate-500">{t.notFoundDescription}</p>
        </div>
      )}
      {!page.loading && !page.error && !page.notFound && page.order && (
        <AdminOrderDetails order={page.order} page={page} />
      )}
    </section>
  );
}
