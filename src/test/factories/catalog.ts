import type { CatalogResult, CategoryFacet } from '../../types/catalog.types';
import { createMockProducts, createMockCategory } from './product';

/**
 * Create a mock category facet.
 */
export function createMockCategoryFacet(
  overrides: Partial<CategoryFacet> = {},
): CategoryFacet {
  const category = createMockCategory();
  return {
    categoryID: category.categoryID,
    name: category.name,
    imageUrl: category.imageUrl,
    parentId: null,
    count: 10,
    ...overrides,
  };
}

/**
 * Create a mock catalog result.
 */
export function createMockCatalogResult(
  overrides: Partial<CatalogResult> = {},
): CatalogResult {
  const items = overrides.items ?? createMockProducts(6);
  return {
    items,
    total: items.length,
    page: 1,
    limit: 12,
    totalPages: 1,
    facets: {
      categories: [createMockCategoryFacet()],
      brands: [
        { name: 'Samsung', count: 5 },
        { name: 'LG', count: 3 },
      ],
      allCount: items.length,
      price: { min: '1000.00', max: '50000.00' },
    },
    ...overrides,
  };
}

/**
 * Create an empty catalog result.
 */
export function createMockEmptyCatalogResult(): CatalogResult {
  return createMockCatalogResult({
    items: [],
    total: 0,
    totalPages: 0,
    facets: {
      categories: [],
      brands: [],
      allCount: 0,
      price: { min: '0.00', max: '0.00' },
    },
  });
}

/**
 * Create a catalog result with pagination.
 */
export function createMockPaginatedCatalogResult(
  page: number,
  totalPages: number,
  itemsPerPage = 12,
): CatalogResult {
  const items = createMockProducts(itemsPerPage);
  return createMockCatalogResult({
    items,
    total: totalPages * itemsPerPage,
    page,
    limit: itemsPerPage,
    totalPages,
  });
}
