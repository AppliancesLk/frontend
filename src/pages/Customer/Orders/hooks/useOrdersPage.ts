import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getOrder, getOrders } from '../../../../services/orderService';
import type { Order } from '../../../../types/order.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';

export function useOrdersPage(id?: string) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      setNotFound(false);
      setData([]);
      try {
        const result = id
          ? [await getOrder(id, controller.signal)]
          : await getOrders(controller.signal);
        if (!controller.signal.aborted) setData(result);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (
          id &&
          axios.isAxiosError(err) &&
          [400, 404].includes(err.response?.status ?? 0)
        )
          setNotFound(true);
        else setError(getApiError(err, translations.orders.loadError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, version]);
  return { data, loading, error, notFound, refresh };
}
