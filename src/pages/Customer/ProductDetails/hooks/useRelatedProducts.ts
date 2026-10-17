import { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../../../services/productService';
import type { Product } from '../../../../types/product.types';
export function useRelatedProducts(product: Product) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    products: Product[];
    error: boolean;
  } | null>(null);
  const key = `${product.productID}:${product.category.categoryID}:${revision}`;
  useEffect(() => {
    const controller = new AbortController();
    getProductsByCategory(product.category.categoryID, controller.signal)
      .then((products) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            products: products
              .filter((item) => item.productID !== product.productID)
              .slice(0, 4),
            error: false,
          });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key, products: [], error: true });
      });
    return () => controller.abort();
  }, [product.productID, product.category.categoryID, key]);
  return {
    loading: result?.key !== key,
    products: result?.key === key ? result.products : [],
    error: result?.key === key && result.error,
    retry: () => setRevision((value) => value + 1),
  };
}
