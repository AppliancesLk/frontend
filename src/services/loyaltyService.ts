import apiClient from '../api/apiClient';
import type { LoyaltySummary } from '../types/loyalty.types';
export const getLoyalty = async (signal?: AbortSignal) =>
  (await apiClient.get<LoyaltySummary>('/loyalty', { signal })).data;
