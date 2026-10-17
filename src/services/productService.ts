import apiClient from '../api/apiClient';
import type {
  Product,
  UpdateProductStockRequest,
} from '../types/product.types';

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

// Route and body follow backend issue #13 (PATCH /products/:id/stock).
// Confirm the final contract once the backend PR is merged.
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
