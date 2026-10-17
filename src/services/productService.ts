import apiClient from '../api/apiClient';
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
