import { useCallback, useEffect, useState } from 'react';
import { getLoyalty } from '../../../../services/loyaltyService';
import type { LoyaltySummary } from '../../../../types/loyalty.types';
import { getApiError } from '../../../../utils/apiErrors';
import { commerceText } from '../../../../utils/commerceText';
export function useLoyaltyPage() {
  const [data, setData] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    getLoyalty(controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          setData(value);
          setError('');
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted)
          setError(getApiError(err, commerceText.creditError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [version]);
  return { data, loading, error, refresh };
}
