import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as repairService from '../../../../../services/repairService';
import type {
  RepairerRepairTicket,
  RepairStatus,
} from '../../../../../types/repair.types';
import { getApiError } from '../../../../../utils/apiErrors';

export function useRepairerRepairDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [repair, setRepair] = useState<RepairerRepairTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [updateError, setUpdateError] = useState('');
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
      const result = await repairService.getRepairerRepair(
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

  const updateStatus = useCallback(
    async (newStatus: RepairStatus) => {
      if (!id || processing) return;
      setProcessing(true);
      setUpdateError('');

      try {
        const updated = await repairService.updateRepairStatus(id, {
          status: newStatus,
        });
        if (alive.current) {
          setRepair(updated);
        }
      } catch (err: unknown) {
        if (alive.current) {
          setUpdateError(
            getApiError(
              err,
              'Failed to update repair status. Please try again.',
            ),
          );
        }
      } finally {
        if (alive.current) {
          setProcessing(false);
        }
      }
    },
    [id, processing],
  );

  return {
    repair,
    loading,
    error,
    processing,
    updateError,
    updateStatus,
    refresh,
    goBack: () => navigate('/repairer/repairs'),
  };
}
