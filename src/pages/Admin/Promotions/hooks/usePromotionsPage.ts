import { useEffect, useState } from 'react';
import { getPromotions } from '../../../../services/promotionService';
import type { PromotionList } from '../../../../types/promotion.types';
import { getApiError } from '../../../../utils/apiErrors';
import { promotionText as t } from '../../../../utils/promotionText';
import { isSending } from '../helpers/promotion.helpers';
export function usePromotionsPage() {
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(''),
    [version, setVersion] = useState(0);
  const [result, setResult] = useState<PromotionList | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const next = await getPromotions(page, search, controller.signal);
        if (!controller.signal.aborted) setResult(next);
      } catch (err) {
        if (!controller.signal.aborted) setError(getApiError(err, t.loadError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [page, search, version]);
  useEffect(() => {
    if (!result?.items.some((item) => isSending(item.latestRun?.status)))
      return;
    const timer = window.setTimeout(() => setVersion((n) => n + 1), 5000);
    return () => window.clearTimeout(timer);
  }, [result]);
  return {
    page,
    setPage,
    search,
    setSearch,
    result,
    loading,
    error,
    refresh: () => setVersion((n) => n + 1),
  };
}
