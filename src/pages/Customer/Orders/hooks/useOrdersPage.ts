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
  const [refreshError, setRefreshError] = useState('');
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let working = false;
    let terminal = false;
    async function load(background = false) {
      if (working) return;
      working = true;
      if (!background) {
        setLoading(true);
        setError('');
        setNotFound(false);
      }
      try {
        const result = id
          ? [await getOrder(id, controller.signal)]
          : await getOrders(controller.signal);
        if (!controller.signal.aborted) {
          setData(result);
          setRefreshError('');
          setError('');
          terminal = Boolean(
            id && ['DELIVERED', 'CANCELLED'].includes(result[0]?.status),
          );
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (background)
          setRefreshError(getApiError(err, translations.orders.loadError));
        else if (
          id &&
          axios.isAxiosError(err) &&
          [400, 404].includes(err.response?.status ?? 0)
        )
          setNotFound(true);
        else setError(getApiError(err, translations.orders.loadError));
      } finally {
        working = false;
        if (!controller.signal.aborted && !background) setLoading(false);
      }
    }
    void load();
    const poll = () => {
      if (document.visibilityState === 'visible' && !terminal) void load(true);
    };
    const timer = id ? window.setInterval(poll, 15000) : undefined;
    window.addEventListener('focus', poll);
    document.addEventListener('visibilitychange', poll);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', poll);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [id, version]);

  return { data, loading, error, notFound, refresh, refreshError };
}
