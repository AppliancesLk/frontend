import { formatCategoryName } from '../../../utils/category';
import { useId, useState } from 'react';
import type {
  CatalogQuery,
  CatalogResult,
  CategoryFacet,
} from '../../../types/catalog.types';
import { translations } from '../../../utils/translations';
import { CategoryIcon } from './CategoryIcon';
const t = translations.catalog;
interface Props {
  facets: CatalogResult['facets'];
  query: CatalogQuery;
  update: (changes: Record<string, string | undefined>) => void;
  clear: () => void;
}
function CategoryList({
  categories,
  parentId,
  selected,
  update,
  depth = 0,
}: {
  categories: CategoryFacet[];
  parentId: string | null;
  selected?: string;
  update: Props['update'];
  depth?: number;
}) {
  if (depth > 10) return null;
  return (
    <ul className={depth ? 'ml-4 border-l border-line-subtle pl-2' : ''}>
      {categories
        .filter((category) => category.parentId === parentId)
        .map((category) => (
          <li key={category.categoryID}>
            <button
              type="button"
              aria-pressed={selected === category.categoryID}
              onClick={() => update({ category: category.categoryID })}
              className={`my-0.5 flex min-h-10 w-full items-center gap-2 rounded-sm px-2 text-left text-sm ${selected === category.categoryID ? 'bg-primary-subtle font-semibold text-fg-link' : 'text-fg-secondary hover:bg-page'}`}
            >
              <CategoryIcon name={formatCategoryName(category.name)} />
              <span className="min-w-0 flex-1 break-words">
                {formatCategoryName(category.name)}
              </span>
              <span className="text-xs tabular-nums">
                {category.count.toLocaleString()}
              </span>
            </button>
            <CategoryList
              categories={categories}
              parentId={category.categoryID}
              selected={selected}
              update={update}
              depth={depth + 1}
            />
          </li>
        ))}
    </ul>
  );
}
export function CatalogFilters({ facets, query, update, clear }: Props) {
  const id = useId();
  const [brandSearch, setBrandSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [min, setMin] = useState(query.minPrice?.toString() ?? '');
  const [max, setMax] = useState(query.maxPrice?.toString() ?? '');
  const selected = query.brands?.split(',') ?? [];
  const brands = facets.brands.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );
  function toggle(name: string) {
    const chosen = selected.some(
      (value) => value.toLowerCase() === name.toLowerCase(),
    );
    const next = chosen
      ? selected.filter((value) => value.toLowerCase() !== name.toLowerCase())
      : [...selected, name];
    update({ brands: next.join(',') || undefined });
  }
  return (
    <div className="space-y-7 rounded-md border border-line bg-surface p-4">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-fg">{t.categories}</h2>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-fg-link hover:underline"
          >
            {t.clear}
          </button>
        </div>
        <button
          type="button"
          aria-pressed={!query.categoryId}
          onClick={() => update({ category: undefined })}
          className={`flex min-h-10 w-full items-center gap-2 rounded-sm px-2 text-left text-sm ${!query.categoryId ? 'bg-primary-subtle font-semibold text-fg-link' : 'text-fg-secondary hover:bg-page'}`}
        >
          <CategoryIcon name="all" />
          <span className="flex-1">{t.all}</span>
          <span className="text-xs">{facets.allCount.toLocaleString()}</span>
        </button>
        <CategoryList
          categories={facets.categories}
          parentId={null}
          selected={query.categoryId}
          update={update}
        />
        {!facets.categories.length && (
          <p className="mt-2 text-xs leading-5 text-fg-muted">
            {t.noCategories}
          </p>
        )}
      </div>
      <fieldset>
        <legend className="mb-3 font-semibold text-fg">{t.brands}</legend>
        <label className="sr-only" htmlFor={id + '-brand-search'}>
          {t.searchBrands}
        </label>
        <input
          id={id + '-brand-search'}
          value={brandSearch}
          onChange={(event) => setBrandSearch(event.target.value)}
          placeholder={t.searchBrands}
          className="ui-field mb-3 min-h-11 w-full rounded-sm border border-line bg-page px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="space-y-1">
          {brands.slice(0, showAll ? undefined : 8).map((brand) => (
            <label
              key={brand.name}
              className="flex min-h-9 cursor-pointer items-center gap-3 rounded-sm px-1 text-sm text-fg-secondary hover:bg-page"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={selected.some(
                  (value) => value.toLowerCase() === brand.name.toLowerCase(),
                )}
                onChange={() => toggle(brand.name)}
              />
              <span className="min-w-0 flex-1 break-words">{brand.name}</span>
              <span className="text-xs tabular-nums">
                {brand.count.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
        {!brands.length && (
          <p className="text-xs text-fg-muted">{t.noBrands}</p>
        )}
        {brands.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="mt-3 text-xs font-medium text-fg-link"
          >
            {showAll ? t.showLess : t.showMore}
          </button>
        )}
      </fieldset>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          update({ minPrice: min || undefined, maxPrice: max || undefined });
        }}
      >
        <h2 className="mb-4 font-semibold text-fg">{t.price}</h2>
        <label className="sr-only" htmlFor={id + '-max-price-slider'}>
          {t.maxPriceSlider}
        </label>
        <input
          id={id + '-max-price-slider'}
          type="range"
          min={0}
          max={Math.max(Number(facets.price.max), Number(max) || 0, 1)}
          step="0.01"
          value={max || facets.price.max}
          onChange={(event) => setMax(event.target.value)}
          className="mb-4 w-full accent-primary"
        />
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: t.minPrice, value: min, set: setMin },
            { label: t.maxPrice, value: max, set: setMax },
          ].map((field, index) => (
            <label key={field.label} className="block text-xs text-fg-muted">
              {field.label}
              <input
                type="number"
                min={index === 1 && min ? Number(min) : 0}
                max={9999999999.99}
                step="0.01"
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
                className="ui-field mt-2 min-h-11 w-full rounded-sm border border-line px-2 text-sm text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
          ))}
        </div>
        <button className="ui-button ui-button-primary mt-3 min-h-11 w-full rounded-sm bg-primary text-sm font-semibold text-primary-on hover:bg-primary-hover">
          {t.apply}
        </button>
      </form>
    </div>
  );
}
