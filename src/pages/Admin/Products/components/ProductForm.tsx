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
            {(['name', 'SKU', 'price', 'stockQty'] as const).map((field) => (
              <div key={field}>
                <label className="auth-label" htmlFor={field}>
                  {
                    {
                      name: t.productName,
                      SKU: t.sku,
                      price: t.price,
                      stockQty: t.initialStock,
                    }[field]
                  }
                </label>
                <input
                  id={field}
                  required
                  className="auth-input"
                  type={
                    field === 'price' || field === 'stockQty'
                      ? 'number'
                      : 'text'
                  }
                  min={0}
                  max={
                    field === 'price'
                      ? 9999999999.99
                      : field === 'stockQty'
                        ? 2147483647
                        : undefined
                  }
                  step={
                    field === 'price'
                      ? '0.01'
                      : field === 'stockQty'
                        ? '1'
                        : undefined
                  }
                  value={page.draft[field]}
                  onChange={(event) =>
                    page.setDraft({
                      ...page.draft,
                      [field]: event.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="categoryID" className="auth-label">
                {t.category}
              </label>
              <select
                id="categoryID"
                required
                className="auth-input"
                value={page.draft.categoryID}
                onChange={(event) =>
                  page.setDraft({
                    ...page.draft,
                    categoryID: event.target.value,
                  })
                }
              >
                <option value="">{t.selectCategory}</option>
                {page.categories.map((category) => (
                  <option key={category.categoryID} value={category.categoryID}>
                    {category.parent ? `${category.parent.name} / ` : ''}
                    {category.name}
                    {!category.isActive ? ` (${t.inactive})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="imageUrls" className="auth-label">
                {t.imageUrls}
              </label>
              <textarea
                id="imageUrls"
                rows={3}
                className="auth-input h-auto py-2"
                value={page.draft.imageUrls}
                onChange={(event) =>
                  page.setDraft({
                    ...page.draft,
                    imageUrls: event.target.value,
                  })
                }
                aria-describedby="image-hint"
              />
              <p id="image-hint" className="mt-2 text-xs text-slate-500">
                {t.imageHint}
              </p>
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
