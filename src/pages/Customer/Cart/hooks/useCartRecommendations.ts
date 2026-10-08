import { useEffect, useState } from 'react';
import { getProductCatalog } from '../../../../services/productService';
import type { Product } from '../../../../types/product.types';
export function useCartRecommendations() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getProductCatalog({ sort: 'newest', page: 1, limit: 20 }, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setProducts(result.items);
          setError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  return { products, error, retry: () => setAttempt((value) => value + 1) };
}
