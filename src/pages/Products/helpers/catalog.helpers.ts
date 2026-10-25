import { CATALOG_SORTS, type CatalogQuery } from '../../../types/catalog.types';
import { isUuid } from '../../../utils/validation';
export function readCatalogQuery(params: URLSearchParams): CatalogQuery | null {
  const q = params.get('q')?.trim() || undefined;
  const categoryId = params.get('category') || undefined;
  const brands = params.get('brands') || undefined;
  const sort = params.get('sort') ?? 'name';
  const rawPage = params.get('page') ?? '1';
  if (
    !/^\d+$/.test(rawPage) ||
    Number(rawPage) < 1 ||
    Number(rawPage) > 1000000 ||
    (q?.length ?? 0) > 120 ||
    (categoryId && !isUuid(categoryId)) ||
    !CATALOG_SORTS.some((value) => value === sort) ||
    (brands &&
      (brands.split(',').length > 20 ||
        brands.split(',').some((brand) => !brand.trim() || brand.length > 80)))
  )
    return null;
  const prices: { minPrice?: number; maxPrice?: number } = {};
  for (const key of ['minPrice', 'maxPrice'] as const) {
    const raw = params.get(key);
    if (raw === null || raw === '') continue;
    if (!/^\d+(?:\.\d{1,2})?$/.test(raw) || Number(raw) > 9999999999.99)
      return null;
    prices[key] = Number(raw);
  }
  if (
    prices.minPrice !== undefined &&
    prices.maxPrice !== undefined &&
    prices.minPrice > prices.maxPrice
  )
    return null;
  return {
    q,
    categoryId,
    brands,
    ...prices,
    sort: sort as CatalogQuery['sort'],
    page: Number(rawPage),
    limit: 12,
  };
}
export function paginationPages(
  page: number,
  total: number,
): (number | 'ellipsis')[] {
  const pages = new Set(
    [1, total, page - 1, page, page + 1].filter(
      (value) => value >= 1 && value <= total,
    ),
  );
  const output: (number | 'ellipsis')[] = [];
  for (const value of [...pages].sort((a, b) => a - b)) {
    const last = output[output.length - 1];
    if (typeof last === 'number' && value - last > 1) output.push('ellipsis');
    output.push(value);
  }
  return output;
}
