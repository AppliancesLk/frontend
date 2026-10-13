import apiClient from '../api/apiClient';
import type { Category } from '../types/category.types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');

  return response.data;
};