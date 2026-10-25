import { useCallback, useEffect, useRef, useState } from 'react';
import * as repairService from '../../../../services/repairService';
import type { RepairerRepairTicket } from '../../../../types/repair.types';
import { getApiError } from '../../../../utils/apiErrors';

export function useRepairerRepairsPage() {
  const [repairs, setRepairs] = useState<RepairerRepairTicket[]>([]);
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
      const result = await repairService.getRepairerRepairs(controller.signal);
      if (!controller.signal.aborted && alive.current) {
        setRepairs(result);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted && alive.current) {
        setError(
          getApiError(
            err,
            'Failed to load assigned repairs. Please try again.',
          ),
        );
      }
    } finally {
      if (!controller.signal.aborted && alive.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    const initialLoad = window.setTimeout(() => void refresh(), 0);
    return () => {
      window.clearTimeout(initialLoad);
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
