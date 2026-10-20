import { CategoryTable } from './components/CategoryTable';
import { CategoryForm } from './components/CategoryForm';
import { useCategoriesPage } from './hooks/useCategoriesPage';
import { CatalogFeedback } from '../../../components/feedback/CatalogFeedback';
import { translations } from '../../../utils/translations';
const t = translations.admin;
export default function CategoriesPage() {
  const page = useCategoriesPage();
  return (
    <section className="space-y-6">
      <header>
        <h1 className="ui-page-title text-slate-900">{t.categories}</h1>
        <p className="mt-2 text-sm text-slate-500">{t.categoriesDescription}</p>
      </header>
      <CatalogFeedback
        loading={page.loading}
        error={page.error}
        retry={page.refresh}
      />
      {!page.loading && !page.error && (
        <>
          <CategoryForm page={page} />
          <CategoryTable page={page} />
        </>
      )}
    </section>
  );
}
