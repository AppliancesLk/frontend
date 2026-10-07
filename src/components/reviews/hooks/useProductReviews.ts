import { useEffect, useState } from 'react';
import { getReviews, getMyReview } from '../../../services/reviewService';
import type { ProductReview, ReviewPage } from '../../../types/review.types';
export function useProductReviews(
  productId: string,
  customerId?: string,
  admin = false,
) {
  const [page, setPage] = useState(1),
    [revision, setRevision] = useState(0);
  const key = `${productId}:${customerId}:${admin}:${page}:${revision}`;
  const [result, setResult] = useState<{
    key: string;
    data?: ReviewPage;
    mine?: ProductReview | null;
    error?: boolean;
  } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([
      getReviews(productId, page, controller.signal, admin),
      customerId
        ? getMyReview(productId, controller.signal)
        : Promise.resolve(null),
    ])
      .then(([data, mine]) => {
        if (!controller.signal.aborted) setResult({ key, data, mine });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key, error: true });
      });
    return () => controller.abort();
  }, [productId, customerId, page, key, admin]);
  const current = result?.key === key ? result : null;
  return {
    data: current?.data,
    mine: current?.mine,
    loading: !current,
    error: current?.error,
    page,
    setPage,
    refresh: () => setRevision((value) => value + 1),
  };
}
