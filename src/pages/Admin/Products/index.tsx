import { ProductTable } from './components/ProductTable';
import { ProductForm } from './components/ProductForm';
import { useProductsPage } from './hooks/useProductsPage';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { translations } from '../../../utils/translations';
import { Dialog } from '../../../components/ui/Dialog';
import { useState } from 'react';
const t = translations.admin;
export default function AdminProductsPage() {
  const page = useProductsPage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="ui-page-title text-fg">{t.products}</h1><p className="mt-2 text-sm text-fg-muted">{t.productsDescription}</p></div>
        <button type="button" className="auth-primary" onClick={() => setDrawerOpen(true)}>{t.addProduct}</button>
      </header>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && (
        <>
          <ProductTable page={page} />
        </>
      )}
      <Dialog open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t.addProduct} drawer busy={page.busy}>
        <ProductForm page={page} />
      </Dialog>
    </section>
  );
}
