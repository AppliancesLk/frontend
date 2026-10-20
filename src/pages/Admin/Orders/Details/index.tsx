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
        className="text-sm font-medium text-fg-link hover:text-fg-link"
      >
        &larr; {t.back}
      </Link>
      <header>
        <h1 className="ui-page-title text-fg">{t.detailsTitle}</h1>
        <p className="mt-2 text-sm text-fg-muted">{t.description}</p>
      </header>
      {page.loading && <LoadingState label={t.loading} compact={false} />}
      {page.error && (
        <div
          role="alert"
          className="rounded-md border border-danger/25 bg-danger-bg p-5 text-sm text-danger"
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
        <div className="rounded-md border border-line bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold text-fg">{t.notFound}</h2>
          <p className="mt-2 text-sm text-fg-muted">{t.notFoundDescription}</p>
        </div>
      )}
      {!page.loading && !page.error && !page.notFound && page.order && (
        <AdminOrderDetails order={page.order} page={page} />
      )}
    </section>
  );
}
