import apiClient from '../api/apiClient';
import type {
  ProductReview,
  ReviewPage,
  SaveReview,
} from '../types/review.types';
export const getReviews = async (
  productId: string,
  page = 1,
  signal?: AbortSignal,
  admin = false,
): Promise<ReviewPage> =>
  (
    await apiClient.get<ReviewPage>(
      `/products/${encodeURIComponent(productId)}/reviews${admin ? '/admin/all' : ''}`,
      { params: { page }, signal },
    )
  ).data;
export const getMyReview = async (
  productId: string,
  signal?: AbortSignal,
): Promise<ProductReview | null> =>
  (
    await apiClient.get<ProductReview | null>(
      `/products/${encodeURIComponent(productId)}/reviews/mine`,
      { signal },
    )
  ).data;
export const saveReview = async (
  productId: string,
  input: SaveReview,
  editing: boolean,
): Promise<ProductReview> =>
  (
    await apiClient.request<ProductReview>({
      method: editing ? 'PUT' : 'POST',
      url: `/products/${encodeURIComponent(productId)}/reviews${editing ? '/mine' : ''}`,
      data: input,
    })
  ).data;
export const deleteReview = async (productId: string, reviewId: string) => {
  await apiClient.delete(
    `/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`,
  );
};
