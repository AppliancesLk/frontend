import { useCallback, useEffect, useRef, useState } from 'react';
import * as repairService from '../../../../services/repairService';
import type { AdminRepairTicket } from '../../../../types/repair.types';
import { getApiError } from '../../../../utils/apiErrors';
import { translations } from '../../../../utils/translations';

const t = translations.adminRepairs;

export function useAdminRepairsPage() {
  const [repairs, setRepairs] = useState<AdminRepairTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const alive = useRef(false);
  const read = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    read.current?.abort();
    const controller = new AbortController();
    read.current = controller;
    setLoading(true);
    setError('');

    try {
      const result = await repairService.getAdminRepairs(controller.signal);
      if (!controller.signal.aborted && alive.current) {
        setRepairs(result);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted && alive.current) {
        setError(getApiError(err, t.loadError));
      }
    } finally {
      if (!controller.signal.aborted && alive.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    void refresh();
    return () => {
      alive.current = false;
      read.current?.abort();
    };
  }, [refresh]);

  return {
    repairs,
    loading,
    error,
    refresh,
  };
}
