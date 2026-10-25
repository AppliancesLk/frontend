import { Link } from 'react-router-dom';
import { useCatalog } from '../../../hooks/useCatalog';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { ROUTES } from '../../../constants/routes';
import { translations } from '../../../utils/translations';
import ReportsPage from '../Reports';
const t = translations.admin;
export default function DashboardPage() {
  const page = useCatalog();
  const metrics = [
    {
      label: t.products,
      value: page.products.length,
      route: ROUTES.adminProducts,
    },
    {
      label: t.categories,
      value: page.categories.length,
      route: ROUTES.adminCategories,
    },
    {
      label: t.totalStock,
      value: page.products.reduce(
        (total, product) => total + product.stockQty,
        0,
      ),
      route: ROUTES.adminInventory,
    },
    {
      label: t.outOfStock,
      value: page.products.filter((product) => product.stockQty === 0).length,
      route: ROUTES.adminInventory,
    },
  ];
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="ui-page-title text-fg">{t.dashboardTitle}</h1>
          <p className="mt-2 text-sm text-fg-muted">{t.dashboardDescription}</p>
        </div>
        <button
          onClick={page.refresh}
          disabled={page.loading}
          className="auth-secondary"
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <Link
                key={metric.label}
                to={metric.route}
                className="rounded-md border border-line bg-surface p-6   "
              >
                <p className="text-sm text-fg-muted">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-fg">
                  {metric.value.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                route: ROUTES.adminProducts,
                title: t.viewProducts,
                detail: t.productsDescription,
              },
              {
                route: ROUTES.adminCategories,
                title: t.viewCategories,
                detail: t.categoriesDescription,
              },
              {
                route: ROUTES.adminInventory,
                title: t.viewInventory,
                detail: t.inventoryDescription,
              },
              {
                route: ROUTES.adminOrders,
                title: translations.adminOrders.title,
                detail: translations.adminOrders.description,
              },
            ].map((item) => (
              <Link
                key={item.route}
                to={item.route}
                className="rounded-md border border-line bg-surface p-6 "
              >
                <h2 className="font-semibold text-fg-link">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-fg-muted">
                  {item.detail}
                </p>
              </Link>
            ))}
          </div>
          <ReportsPage />
        </>
      )}
    </section>
  );
}
