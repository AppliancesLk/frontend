import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { translations } from '../../../utils/translations';
import { AdminOrdersTable } from './components/AdminOrdersTable';
import { useAdminOrdersPage } from './hooks/useAdminOrdersPage';

const t = translations.adminOrders;
export default function AdminOrdersPage() {
  const page = useAdminOrdersPage();
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="ui-page-title text-slate-900">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.description}</p>
        </div>
        <button
          type="button"
          onClick={page.refresh}
          disabled={page.loading}
          className="auth-secondary disabled:opacity-50"
        >
          {t.refresh}
        </button>
      </header>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && (
        <AdminOrdersTable orders={page.orders} />
      )}
    </section>
  );
}
