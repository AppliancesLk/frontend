import { Spinner } from '../../../../components/ui/Feedback';
import { ProductFields } from './ProductFields';
import type { useProductsPage } from '../hooks/useProductsPage';
import { translations } from '../../../../utils/translations';
import { ROUTES } from '../../../../constants/routes';
import { Link } from 'react-router-dom';
const t = translations.admin;
export function ProductForm({
  page,
}: {
  page: ReturnType<typeof useProductsPage>;
}) {
  return (
    <section className="rounded-md border border-line bg-surface p-5  sm:p-6">
      <h2 className="mb-5 text-xl font-semibold text-fg">{t.addProduct}</h2>
      {page.categories.length === 0 ? (
        <p className="text-sm text-fg-secondary">
          {t.categoryRequired}{' '}
          <Link
            to={ROUTES.adminCategories}
            className="font-medium text-fg-link"
          >
            {t.addCategory}
          </Link>
        </p>
      ) : (
        <form onSubmit={page.submit}>
          <fieldset disabled={page.busy} className="grid gap-5 sm:grid-cols-2">
            <ProductFields
              onUploadState={page.setUploading}
              draft={page.draft}
              categories={page.categories}
              onChange={(field, value) =>
                page.setDraft({ ...page.draft, [field]: value })
              }
            />
            <div>
              <label htmlFor="stockQty" className="auth-label">
                {t.initialStock}
              </label>
              <input
                id="stockQty"
                type="number"
                min={0}
                max={2147483647}
                step={1}
                required
                className="ui-field auth-input"
                value={page.draft.stockQty}
                onChange={(event) =>
                  page.setDraft({ ...page.draft, stockQty: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="specifications" className="auth-label">
                {t.specifications}
              </label>
              <textarea
                id="specifications"
                rows={3}
                className="ui-field auth-input h-auto py-2"
                value={page.draft.specifications}
                onChange={(event) =>
                  page.setDraft({
                    ...page.draft,
                    specifications: event.target.value,
                  })
                }
                aria-describedby="spec-hint"
              />
              <p id="spec-hint" className="mt-2 text-xs text-fg-muted">
                {t.specificationsHint}
              </p>
            </div>
            <div className="sm:col-span-2">
              <button className="auth-primary" type="submit">
                {page.busy && <Spinner className="mr-2" />}
                {page.busy ? t.saving : t.addProduct}
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {page.formError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {page.formError}
        </p>
      )}
      {page.success && (
        <p role="status" className="mt-4 text-sm text-success">
          {page.success}
        </p>
      )}
    </section>
  );
}
