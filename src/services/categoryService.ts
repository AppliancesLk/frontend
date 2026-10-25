import apiClient from '../api/apiClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category.types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');

  return response.data;
};
export const createCategory = async (
  input: CreateCategoryRequest,
): Promise<Category> =>
  (await apiClient.post<Category>('/categories', input)).data;
export const updateCategory = async (
  id: string,
  input: UpdateCategoryRequest,
): Promise<Category> =>
  (await apiClient.patch<Category>(`/categories/${id}`, input)).data;

export const getAdminCategories = async (
  signal?: AbortSignal,
): Promise<Category[]> =>
  (await apiClient.get<Category[]>('/categories/admin/all', { signal })).data;
