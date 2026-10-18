import type { Category } from './category.types';
export const PRODUCT_BADGES = ['NEW', 'HOT', 'DEAL'] as const;
export type ProductBadge = (typeof PRODUCT_BADGES)[number];
export interface ProductCatalogFields {
  brand?: string | null;
  subtitle?: string;
  badge?: ProductBadge | null;
  compareAtPrice?: string | number | null;
  createdAt?: string | null;
}

export interface Product extends ProductCatalogFields {
  productID: string;
  name: string;
  SKU: string;
  price: string | number;
  stockQty: number;
  images: string[];
  specifications: Record<string, unknown> | null;
  isActive: boolean;
  category: Category;
}

export interface UpdateProductStockRequest {
  stockQty: number;
}
export interface CreateProductRequest {
  brand?: string | null;
  subtitle?: string;
  badge?: ProductBadge | null;
  compareAtPrice?: number | null;
  name: string;
  SKU: string;
  price: number;
  categoryID: string;
  stockQty: number;
  images: string[];
  specifications?: Record<string, string>;
  isActive?: boolean;
}
export interface UpdateProductRequest {
  brand?: string | null;
  subtitle?: string;
  badge?: ProductBadge | null;
  compareAtPrice?: number | null;
  name?: string;
  SKU?: string;
  price?: number;
  categoryID?: string;
  images?: string[];
  specifications?: Record<string, unknown> | null;
  isActive?: boolean;
}
