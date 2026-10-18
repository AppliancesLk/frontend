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
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">
        {t.addProduct}
      </h2>
      {page.categories.length === 0 ? (
        <p className="text-sm text-slate-600">
          {t.categoryRequired}{' '}
          <Link
            to={ROUTES.adminCategories}
            className="font-medium text-blue-600"
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
                className="auth-input"
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
                className="auth-input h-auto py-2"
                value={page.draft.specifications}
                onChange={(event) =>
                  page.setDraft({
                    ...page.draft,
                    specifications: event.target.value,
                  })
                }
                aria-describedby="spec-hint"
              />
              <p id="spec-hint" className="mt-2 text-xs text-slate-500">
                {t.specificationsHint}
              </p>
            </div>
            <div className="sm:col-span-2">
              <button className="auth-primary" type="submit">
                {page.busy ? t.saving : t.addProduct}
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {page.formError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {page.formError}
        </p>
      )}
      {page.success && (
        <p role="status" className="mt-4 text-sm text-green-700">
          {page.success}
        </p>
      )}
    </section>
  );
}
