import apiClient from '../api/apiClient';
import type {
  PromotionContent,
  PromotionDetail,
  PromotionList,
  PromotionPreview,
  PromotionRun,
  PromotionRunDetail,
} from '../types/promotion.types';
const root = '/admin/promotions';
export const getPromotions = async (
  page: number,
  search: string,
  signal?: AbortSignal,
) =>
  (
    await apiClient.get<PromotionList>(root, {
      params: { page, search },
      signal,
    })
  ).data;
export const getPromotion = async (id: string, signal?: AbortSignal) =>
  (
    await apiClient.get<PromotionDetail>(`${root}/${encodeURIComponent(id)}`, {
      signal,
    })
  ).data;
export const createPromotion = async (input: PromotionContent) =>
  (await apiClient.post<PromotionDetail>(root, input)).data;
export const updatePromotion = async (
  id: string,
  input: PromotionContent,
  version: number,
) =>
  (
    await apiClient.patch<PromotionDetail>(
      `${root}/${encodeURIComponent(id)}`,
      { ...input, version },
    )
  ).data;
export const previewPromotion = async (
  input: PromotionContent,
  signal?: AbortSignal,
) =>
  (
    await apiClient.post<PromotionPreview>(`${root}/preview`, input, {
      signal,
      timeout: 15000,
    })
  ).data;
export const sendPromotion = async (
  id: string,
  input: { version: number; requestId: string; expectedRecipients: number },
) =>
  (
    await apiClient.post<PromotionRun>(
      `${root}/${encodeURIComponent(id)}/send`,
      input,
    )
  ).data;
export const getPromotionRun = async (
  id: string,
  runId: string,
  page: number,
  signal?: AbortSignal,
) =>
  (
    await apiClient.get<PromotionRunDetail>(
      `${root}/${encodeURIComponent(id)}/runs/${encodeURIComponent(runId)}`,
      { params: { page }, signal },
    )
  ).data;
