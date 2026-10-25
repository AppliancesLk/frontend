import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
} from '../../../../services/orderService';
import type { AdminOrder, OrderStatus } from '../../../../types/order.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';

const t = translations.adminOrders;

export function useAdminOrdersPage(id?: string) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [success, setSuccess] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        const result = id
          ? [await getAdminOrder(id, controller.signal)]
          : await getAdminOrders(controller.signal);
        if (!controller.signal.aborted) setOrders(result);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        if (
          id &&
          axios.isAxiosError(err) &&
          [400, 404].includes(err.response?.status ?? 0)
        )
          setNotFound(true);
        else setError(getApiError(err, t.loadError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [id, version]);

  async function updateStatus(status: OrderStatus, paymentCollected = false) {
    if (!id || saving) return;
    setSaving(true);
    setUpdateError('');
    setSuccess('');
    try {
      const updated = await updateAdminOrderStatus(
        id,
        status,
        paymentCollected,
      );
      setOrders([updated]);
      setSuccess(t.updateSuccess);
    } catch (err: unknown) {
      setUpdateError(getApiError(err, t.updateError));
    } finally {
      setSaving(false);
    }
  }

  return {
    orders,
    order: orders[0],
    loading,
    saving,
    error,
    updateError,
    success,
    notFound,
    refresh,
    updateStatus,
  };
}
