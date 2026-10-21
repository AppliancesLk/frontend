import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { ROUTES } from '../../../../constants/routes';
import { translations } from '../../../../utils/translations';
import { CatalogFeedback } from '../../../../components/feedback/CatalogFeedback';
import { useOrdersPage } from '../hooks/useOrdersPage';
import { OrdersShell } from '../components/OrdersShell';
import { OrderDetails } from '../components/OrderDetails';
export default function OrderDetailsPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  return user && id ? (
    <DetailsContent key={`${user.id}:${id}`} id={id} />
  ) : null;
}
function DetailsContent({ id }: { id: string }) {
  const page = useOrdersPage(id);
  const t = translations.orders;
  return (
    <OrdersShell details refresh={page.refresh} loading={page.loading}>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {page.refreshError && (
        <p role="status" className="ui-alert ui-tone-warning">
          {page.refreshError}
        </p>
      )}
      {page.notFound && (
        <section className="rounded-md border border-line bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-fg">{t.notFound}</h2>
          <p className="mt-2 text-sm text-fg-muted">{t.notFoundDescription}</p>
          <Link to={ROUTES.orders} className="auth-primary mt-6">
            {t.back}
          </Link>
        </section>
      )}
      {!page.loading && !page.error && !page.notFound && page.data[0] && (
        <OrderDetails order={page.data[0]} refresh={page.refresh} />
      )}
    </OrdersShell>
  );
}
