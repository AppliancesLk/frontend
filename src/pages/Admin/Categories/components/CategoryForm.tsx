import type { useCategoriesPage } from '../hooks/useCategoriesPage';
import { translations } from '../../../../utils/translations';
import { ImageUploader } from '../../../../components/forms/ImageUploader';
const t = translations.admin;
export function CategoryForm({
  page,
}: {
  page: ReturnType<typeof useCategoriesPage>;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-semibold text-slate-900">
        {page.editing ? translations.experience.editCategory : t.addCategory}
      </h2>
      <form onSubmit={page.submit}>
        <fieldset
          disabled={page.busy}
          className="grid items-end gap-5 md:grid-cols-[1fr_1fr_auto]"
        >
          <div>
            <label className="auth-label" htmlFor="category-name">
              {t.categoryName}
            </label>
            <input
              required
              minLength={2}
              id="category-name"
              className="auth-input"
              value={page.name}
              onChange={(event) => page.setName(event.target.value)}
            />
          </div>
          <div>
            <label className="auth-label" htmlFor="parent-category">
              {t.parentCategory}
            </label>
            <select
              id="parent-category"
              className="auth-input"
              value={page.parentID}
              onChange={(event) => page.setParentID(event.target.value)}
            >
              <option value="">{t.noParent}</option>
              {page.categories
                .filter(
                  (category) =>
                    category.isActive && category.categoryID !== page.editing,
                )
                .map((category) => (
                  <option value={category.categoryID} key={category.categoryID}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <button type="submit" className="auth-primary">
            {page.busy
              ? t.saving
              : page.editing
                ? translations.experience.save
                : t.addCategory}
          </button>
          <div className="md:col-span-3">
            <p className="mb-3 text-sm font-medium text-slate-700">
              {translations.experience.categoryImage}
            </p>
            <ImageUploader
              max={1}
              value={page.imageUrl ? [page.imageUrl] : []}
              onChange={(images) => page.setImageUrl(images[0] ?? '')}
              onBusyChange={page.setUploading}
            />
          </div>
          {page.editing && (
            <button
              type="button"
              className="auth-secondary"
              onClick={page.cancelEdit}
            >
              {translations.experience.cancel}
            </button>
          )}
        </fieldset>
      </form>
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
