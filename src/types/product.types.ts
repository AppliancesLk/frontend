import type { Category } from './category.types';

export interface Product {
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
  name?: string;
  SKU?: string;
  price?: number;
  categoryID?: string;
  images?: string[];
  specifications?: Record<string, unknown> | null;
  isActive?: boolean;
}
