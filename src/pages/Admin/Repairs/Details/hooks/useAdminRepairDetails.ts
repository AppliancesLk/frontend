import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as repairService from '../../../../../services/repairService';
import type { AdminRepairTicket } from '../../../../../types/repair.types';
import { getApiError } from '../../../../../utils/apiErrors';
import { translations } from '../../../../../utils/translations';
import { ROUTES } from '../../../../../constants/routes';
import { getAdminUsers } from '../../../../../services/userService';
import type { AdminUser } from '../../../../../types/user.types';

const t = translations.adminRepairs;

type Action = 'approve' | 'reject' | null;

export function useAdminRepairDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [repair, setRepair] = useState<AdminRepairTicket | null>(null);
  const [repairers, setRepairers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [action, setAction] = useState<Action>(null);
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
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
      const [result, users] = await Promise.all([
        repairService.getAdminRepair(id, controller.signal),
        getAdminUsers(
          { page: 1, search: '', role: 'REPAIRER', status: 'active' },
          controller.signal,
        ),
      ]);
      if (!controller.signal.aborted && alive.current) {
        setRepair(result);
        setRepairers(users.items);
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

  const approveRepair = useCallback(async () => {
    if (!id || processing) return;
    setProcessing(true);
    setActionError('');

    try {
      const updated = await repairService.approveRepair(id);
      if (alive.current) {
        setRepair(updated);
        setAction(null);
      }
    } catch (err: unknown) {
      if (alive.current) {
        setActionError(getApiError(err, t.approveError));
      }
    } finally {
      if (alive.current) {
        setProcessing(false);
      }
    }
  }, [id, processing]);

  const rejectRepair = useCallback(async () => {
    if (!id || processing) return;
    setProcessing(true);
    setActionError('');

    try {
      const updated = await repairService.rejectRepair(id, {
        rejectionReason: rejectionReason.trim() || undefined,
      });
      if (alive.current) {
        setRepair(updated);
        setAction(null);
        setRejectionReason('');
      }
    } catch (err: unknown) {
      if (alive.current) {
        setActionError(getApiError(err, t.rejectError));
      }
    } finally {
      if (alive.current) {
        setProcessing(false);
      }
    }
  }, [id, processing, rejectionReason]);

  const assignRepair = useCallback(
    async (repairerId: string) => {
      if (!id || processing || !repairerId) return;
      setProcessing(true);
      setActionError('');
      try {
        const updated = await repairService.assignRepair(id, repairerId);
        if (alive.current) setRepair(updated);
      } catch (err: unknown) {
        if (alive.current) {
          setActionError(getApiError(err, 'Unable to assign this repairer.'));
        }
      } finally {
        if (alive.current) setProcessing(false);
      }
    },
    [id, processing],
  );

  return {
    repair,
    repairers,
    loading,
    error,
    action,
    processing,
    actionError,
    rejectionReason,
    setAction,
    setRejectionReason,
    approveRepair,
    rejectRepair,
    assignRepair,
    refresh,
    goBack: () => navigate(ROUTES.adminRepairs),
  };
}
