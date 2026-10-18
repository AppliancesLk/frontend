import apiClient from '../api/apiClient';
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append('image', file);
  return (
    await apiClient.post<{ imageUrl: string }>('/media/images', body, {
      headers: { 'Content-Type': undefined },
    })
  ).data.imageUrl;
}
