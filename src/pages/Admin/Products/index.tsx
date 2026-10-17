import { ProductTable } from './components/ProductTable';
import { ProductForm } from './components/ProductForm';
import { useProductsPage } from './hooks/useProductsPage';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { translations } from '../../../utils/translations';
const t = translations.admin;
export default function AdminProductsPage() {
  const page = useProductsPage();
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {t.products}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{t.productsDescription}</p>
      </header>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && (
        <>
          <ProductForm page={page} />
          <ProductTable page={page} />
        </>
      )}
    </section>
  );
}
