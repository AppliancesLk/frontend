import type { Product } from './product.types';
export const CATALOG_SORTS = [
  'name',
  'price-asc',
  'price-desc',
  'newest',
] as const;
export type CatalogSort = (typeof CATALOG_SORTS)[number];
export interface CatalogQuery {
  q?: string;
  categoryId?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: CatalogSort;
  page: number;
  limit: number;
}
export interface CategoryFacet {
  imageUrl?:string|null;
  categoryID: string;
  name: string;
  parentId: string | null;
  count: number;
}
export interface CatalogResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: {
    categories: CategoryFacet[];
    brands: { name: string; count: number }[];
    allCount: number;
    price: { min: string; max: string };
  };
}
