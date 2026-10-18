export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  author: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ReviewSummary {
  average: number;
  count: number;
  distribution: { rating: number; count: number }[];
}
export interface ReviewPage {
  items: ProductReview[];
  total: number;
  page: number;
  totalPages: number;
  summary: ReviewSummary;
}
export interface SaveReview {
  rating: number;
  title: string;
  body: string;
}
