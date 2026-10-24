import apiClient from '../api/apiClient';
export function imageUrl(source?: string) {
  if (
    source?.startsWith('/media/images/') ||
    source?.startsWith('/banners/images/') ||
    source?.startsWith('/products/')
  )
    return `${apiClient.defaults.baseURL?.replace(/\/$/, '')}${source}`;
  return source;
}
