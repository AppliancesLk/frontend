import { CategoryTable } from './components/CategoryTable';
import { CategoryForm } from './components/CategoryForm';
import { useCategoriesPage } from './hooks/useCategoriesPage';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { translations } from '../../../utils/translations';
import { Dialog } from '../../../components/ui/Dialog';
import { useState } from 'react';
const t = translations.admin;
export default function CategoriesPage() {
  const page = useCategoriesPage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="ui-page-title text-fg">{t.categories}</h1><p className="mt-2 text-sm text-fg-muted">{t.categoriesDescription}</p></div>
        <button type="button" className="auth-primary" onClick={() => setDrawerOpen(true)}>{t.addCategory}</button>
      </header>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && (
        <>
          <CategoryTable page={page} />
        </>
      )}
      <Dialog open={drawerOpen || Boolean(page.editing)} onClose={() => { setDrawerOpen(false); page.cancelEdit(); }} title={page.editing ? translations.experience.editCategory : t.addCategory} drawer busy={page.busy}>
        <CategoryForm page={page} />
      </Dialog>
    </section>
  );
}
