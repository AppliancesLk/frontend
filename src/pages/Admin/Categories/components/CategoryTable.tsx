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
          <table className="w-full text-left text-sm">
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
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {category.imageUrl && (
                      <ProductImage
                        src={category.imageUrl}
                        alt={category.name}
                        className="mb-2 h-14 w-14 rounded-lg"
                      />
                    )}
                    {category.name}
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs ${category.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {category.isActive ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {category.parent?.name ?? t.topLevel}
                  </td>
                  <td className="px-5 py-4">
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
