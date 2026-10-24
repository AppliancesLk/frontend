import apiClient from '../api/apiClient';
import type { CatalogQuery, CatalogResult } from '../types/catalog.types';
export const getProductCatalog = async (
  query: CatalogQuery,
  signal?: AbortSignal,
): Promise<CatalogResult> =>
  (
    await apiClient.get<CatalogResult>('/products/catalog', {
      params: query,
      signal,
    })
  ).data;
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductStockRequest,
} from '../types/product.types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products');

  return response.data;
};

export const getProductsByCategory = async (
  categoryID: string,
  signal?: AbortSignal,
): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products', {
    signal,
    params: {
      categoryId: categoryID,
    },
  });

  return response.data;
};

export const updateProductStock = async (
  productID: string,
  stockQty: number,
): Promise<Product> => {
  const payload: UpdateProductStockRequest = { stockQty };

  const response = await apiClient.patch<Product>(
    `/products/${productID}/stock`,
    payload,
  );

  return response.data;
};

export const createProduct = async (
  input: CreateProductRequest,
): Promise<Product> => (await apiClient.post<Product>('/products', input)).data;
export const updateProduct = async (
  id: string,
  input: UpdateProductRequest,
): Promise<Product> =>
  (await apiClient.patch<Product>(`/products/${id}`, input)).data;
export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${encodeURIComponent(id)}`);
};

export interface ProductImageUploadResult { imageID: string; imageUrl: string }
export const uploadProductImage = async (productID: string, file: File): Promise<ProductImageUploadResult> => {
  const body = new FormData();
  body.append('image', file);
  return (await apiClient.post<ProductImageUploadResult>(`/products/${encodeURIComponent(productID)}/images`, body, { headers: { 'Content-Type': undefined } })).data;
};
export const deleteProductImage = async (productID: string, imageID: string): Promise<void> => {
  await apiClient.delete(`/products/${encodeURIComponent(productID)}/images/${encodeURIComponent(imageID)}`);
};

export const getAdminProducts = async (): Promise<Product[]> =>
  (await apiClient.get<Product[]>('/products/admin/all')).data;

export const getProductById = async (
  productID: string,
  signal?: AbortSignal,
): Promise<Product> =>
  (
    await apiClient.get<Product>(`/products/${encodeURIComponent(productID)}`, {
      signal,
    })
  ).data;

export const getAdminProductById = async (
  id: string,
  signal?: AbortSignal,
): Promise<Product> =>
  (
    await apiClient.get<Product>(`/products/admin/${encodeURIComponent(id)}`, {
      signal,
    })
  ).data;
