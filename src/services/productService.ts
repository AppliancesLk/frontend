import apiClient from '../api/apiClient';
import type { Product } from '../types/product.types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products');

  return response.data;
};

export const getProductsByCategory = async (
  categoryID: string,
): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products', {
    params: {
      categoryId: categoryID,
    },
  });

  return response.data;
};