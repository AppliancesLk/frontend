import { useAuth } from '../../../hooks/useAuth';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { useOrdersPage } from './hooks/useOrdersPage';
import { OrdersShell } from './components/OrdersShell';
import { OrderList } from './components/OrderList';
export default function OrdersPage() {
  const { user } = useAuth();
  return user ? <OrdersContent key={user.id} /> : null;
}
function OrdersContent() {
  const page = useOrdersPage();
  return (
    <OrdersShell refresh={page.refresh} loading={page.loading}>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && <OrderList orders={page.data} />}
    </OrdersShell>
  );
}
