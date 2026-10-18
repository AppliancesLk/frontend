import { Link } from 'react-router-dom';
import type { useProductEdit } from '../hooks/useProductEdit';
import { ProductFields } from '../../components/ProductFields';
import { SpecificationEntries } from './SpecificationEditor';
import { ROUTES } from '../../../../../constants/routes';
import { translations } from '../../../../../utils/translations';
const t = translations.productEdit;
export function ProductEditForm({
  page,
}: {
  page: ReturnType<typeof useProductEdit>;
}) {
  const editor = page.editor;
  if (!editor) return null;
  const { draft, categories, product } = editor;
  const options = categories.some(
    (category) => category.categoryID === draft.categoryID,
  )
    ? categories
    : [...categories, product.category];
  return (
    <form onSubmit={page.submit} className="space-y-6">
      {editor.restored && (
        <p
          role="status"
          className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
        >
          {t.restored}
        </p>
      )}
      {page.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {page.error}
        </p>
      )}
      {page.success && (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {page.success}
        </p>
      )}
      <fieldset
        disabled={page.busy}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <legend className="sr-only">{t.title}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <ProductFields
            onUploadState={page.setUploading}
            editing
            draft={draft}
            categories={options}
            onChange={(field, value) =>
              page.changeDraft({ ...draft, [field]: value })
            }
          />
        </div>
        <div className="mt-6 border-t border-slate-200 pt-5">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={draft.isActive}
              onChange={(event) =>
                page.changeDraft({ ...draft, isActive: event.target.checked })
              }
            />
            {t.availability}
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {t.availabilityHint}
          </p>
        </div>
      </fieldset>
      <fieldset
        disabled={page.busy}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <legend className="sr-only">{translations.admin.specifications}</legend>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {translations.admin.specifications}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {t.specificationsHint}
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-red-600 hover:text-red-700"
            onClick={() =>
              page.changeDraft({
                ...draft,
                specifications: [],
                specificationsMode: 'clear',
              })
            }
          >
            {t.clearSpecifications}
          </button>
        </div>
        {draft.specifications.length === 0 && (
          <p className="mb-4 text-sm text-slate-500">
            {draft.specificationsMode === 'clear'
              ? t.clearedSpecifications
              : t.emptySpecifications}
          </p>
        )}
        <SpecificationEntries
          entries={draft.specifications}
          onChange={(entries) =>
            page.changeDraft({
              ...draft,
              specifications: entries,
              specificationsMode: 'replace',
            })
          }
        />
      </fieldset>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-600">
          {t.inventoryHint}{' '}
          <span className="font-medium">
            {translations.admin.currentStock}{' '}
            {product.stockQty.toLocaleString()}
          </span>
        </p>
        <Link
          to={ROUTES.adminInventory}
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {t.inventoryLink}
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="auth-primary disabled:cursor-not-allowed"
          disabled={page.busy || !page.dirty}
        >
          {page.busy ? translations.admin.saving : t.save}
        </button>
        <Link className="auth-secondary" to={ROUTES.adminProducts}>
          {t.cancel}
        </Link>
        {page.dirty && (
          <span className="text-xs text-amber-700">{t.unsaved}</span>
        )}
      </div>
    </form>
  );
}
