import { StatusBadge } from '../../../../components/ui/StatusBadge';
import type { useCategoriesPage } from '../hooks/useCategoriesPage';
import { translations } from '../../../../utils/translations';
import { ProductImage } from '../../../../components/common/ProductImage';
const t = translations.admin;
export function CategoryTable({
  page,
}: {
  page: ReturnType<typeof useCategoriesPage>;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-200 p-5 text-xl font-semibold text-slate-900">
        {t.categoryList} ({page.categories.length})
      </h2>
      {page.categories.length === 0 ? (
        <p className="p-6 text-sm text-slate-500">{t.noCategories}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="ui-table ui-card-table w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[t.categoryName, t.parentCategory, t.actions].map((label) => (
                  <th key={label} scope="col" className="px-5 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.categories.map((category) => (
                <tr
                  key={category.categoryID}
                  className="border-t border-slate-200"
                >
                  <td
                    data-label={t.categoryName}
                    className="px-5 py-4 font-medium text-slate-900"
                  >
                    <div className="ui-cell-value">
                      {category.imageUrl && (
                        <ProductImage
                          src={category.imageUrl}
                          alt={category.name}
                          className="mb-2 h-14 w-14 rounded-lg"
                        />
                      )}
                      {category.name}
                      <StatusBadge
                        status={category.isActive ? 'ACTIVE' : 'INACTIVE'}
                      >
                        {category.isActive ? t.active : t.inactive}
                      </StatusBadge>
                    </div>
                  </td>
                  <td
                    data-label={t.parentCategory}
                    className="px-5 py-4 text-slate-600"
                  >
                    <div className="ui-cell-value">
                      {category.parent?.name ?? t.topLevel}
                    </div>
                  </td>
                  <td data-label={t.actions} className="px-5 py-4">
                    <div className="ui-cell-value">
                      <button
                        disabled={page.busy}
                        className="auth-secondary mr-2"
                        onClick={() => page.edit(category)}
                      >
                        {translations.experience.editCategory}
                      </button>
                      <button
                        className="auth-secondary"
                        disabled={page.updating !== null}
                        onClick={() => void page.toggle(category)}
                      >
                        {page.updating === category.categoryID
                          ? t.saving
                          : category.isActive
                            ? t.deactivate
                            : t.activate}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
