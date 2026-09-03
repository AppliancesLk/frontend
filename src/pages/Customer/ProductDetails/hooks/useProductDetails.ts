import { useEffect, useState } from 'react';
import axios from 'axios';
import { getProductById } from '../../../../services/productService';
import type { Product } from '../../../../types/product.types';
import { isProductId } from '../helpers/product-details.helpers';
type ProductResult =
  | { key: string; status: 'ready'; product: Product }
  | { key: string; status: 'error' | 'not-found'; product: null };
export function useProductDetails(id?: string) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<ProductResult | null>(null);
  const key = `${id}:${revision}`;
  useEffect(() => {
    if (!isProductId(id)) return;
    const controller = new AbortController();
    getProductById(id, controller.signal)
      .then((product) => {
        if (!controller.signal.aborted)
          setResult({ key, status: 'ready', product });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const missing =
          axios.isAxiosError(error) &&
          [400, 404].includes(error.response?.status ?? 0);
        setResult({
          key,
          status: missing ? 'not-found' : 'error',
          product: null,
        });
      });
    return () => controller.abort();
  }, [id, key]);
  const current = !isProductId(id)
    ? { status: 'not-found' as const, product: null }
    : result?.key === key
      ? result
      : { status: 'loading' as const, product: null };
  return { ...current, retry: () => setRevision((value) => value + 1) };
}
