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