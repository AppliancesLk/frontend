import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as repairService from '../../../../../services/repairService';
import type { RepairTicket } from '../../../../../types/repair.types';
import { getApiError } from '../../../../../utils/apiErrors';
import { ROUTES } from '../../../../../constants/routes';

export function useCustomerRepairDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [repair, setRepair] = useState<RepairTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const alive = useRef(false);
  const read = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    read.current?.abort();
    const controller = new AbortController();
    read.current = controller;
    setLoading(true);
    setError('');

    try {
      const result = await repairService.getCustomerRepair(
        id,
        controller.signal,
      );
      if (!controller.signal.aborted && alive.current) {
        setRepair(result);
      }
    } catch (err: unknown) {
      if (!controller.signal.aborted && alive.current) {
        setError(
          getApiError(err, 'Failed to load repair details. Please try again.'),
        );
      }
    } finally {
      if (!controller.signal.aborted && alive.current) {
        setLoading(false);
      }
    }
  }, [id]);

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
    repair,
    loading,
    error,
    refresh,
    goBack: () => navigate(ROUTES.repairs),
  };
}
