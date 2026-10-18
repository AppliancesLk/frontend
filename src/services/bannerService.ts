import apiClient from '../api/apiClient';
import type { BannerPosition, BannerSection } from '../types/banner.types';
export const getBanners = async (admin = false): Promise<BannerSection[]> =>
  (
    await apiClient.get<BannerSection[]>(
      admin ? '/banners/admin/all' : '/banners',
    )
  ).data;
export const saveBanner = async (
  position: BannerPosition,
  input: Pick<BannerSection, 'visible' | 'slides'>,
): Promise<BannerSection> =>
  (await apiClient.put<BannerSection>(`/banners/${position}`, input)).data;
export const uploadBannerImage = async (file: File): Promise<string> => {
  const body = new FormData();
  body.append('image', file);
  return (
    await apiClient.post<{ imageUrl: string }>('/banners/images', body, {
      headers: { 'Content-Type': undefined },
    })
  ).data.imageUrl;
};
export function bannerImageUrl(url: string) {
  return url.startsWith('/banners/images/')
    ? `${apiClient.defaults.baseURL?.replace(/\/$/, '')}${url}`
    : url;
}
