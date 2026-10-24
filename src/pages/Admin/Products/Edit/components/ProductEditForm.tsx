import { Spinner } from '../../../../../components/ui/Feedback';
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
          className="rounded-sm border border-primary bg-primary-subtle p-4 text-sm text-fg-link"
        >
          {t.restored}
        </p>
      )}
      {page.error && (
        <p
          role="alert"
          className="rounded-sm border border-danger/25 bg-danger-bg p-4 text-sm text-danger"
        >
          {page.error}
        </p>
      )}
      {page.success && (
        <p
          role="status"
          className="rounded-sm border border-success/25 bg-success-bg p-4 text-sm text-success"
        >
          {page.success}
        </p>
      )}
      <fieldset
        disabled={page.busy}
        className="rounded-md border border-line bg-surface p-5  sm:p-6"
      >
        <legend className="sr-only">{t.title}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <ProductFields
            onUploadState={page.setUploading}
            editing
              productID={product.productID}
            draft={draft}
            categories={options}
            onChange={(field, value) =>
              page.changeDraft({ ...draft, [field]: value })
            }
          />
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <label className="flex items-center gap-3 text-sm font-medium text-fg">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={draft.isActive}
              onChange={(event) =>
                page.changeDraft({ ...draft, isActive: event.target.checked })
              }
            />
            {t.availability}
          </label>
          <p className="mt-2 text-xs leading-5 text-fg-muted">
            {t.availabilityHint}
          </p>
        </div>
      </fieldset>
      <fieldset
        disabled={page.busy}
        className="rounded-md border border-line bg-surface p-5  sm:p-6"
      >
        <legend className="sr-only">{translations.admin.specifications}</legend>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-fg">
              {translations.admin.specifications}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">{t.specificationsHint}</p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-danger hover:text-danger"
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
          <p className="mb-4 text-sm text-fg-muted">
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
      <div className="rounded-md border border-line bg-surface p-5  sm:p-6">
        <p className="text-sm text-fg-secondary">
          {t.inventoryHint}{' '}
          <span className="font-medium">
            {translations.admin.currentStock}{' '}
            {product.stockQty.toLocaleString()}
          </span>
        </p>
        <Link
          to={ROUTES.adminInventory}
          className="mt-3 inline-block text-sm font-medium text-fg-link hover:text-fg-link"
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
          {page.busy && <Spinner className="mr-2" />}
          {page.busy ? translations.admin.saving : t.save}
        </button>
        <Link className="auth-secondary" to={ROUTES.adminProducts}>
          {t.cancel}
        </Link>
        {page.dirty && (
          <span className="text-xs text-warning">{t.unsaved}</span>
        )}
      </div>
    </form>
  );
}
