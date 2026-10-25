import { useEffect, useRef, useState } from 'react';
import { getAdminUsers, setUserActive } from '../../../../services/userService';
import type {
  AdminUser,
  AdminUsersResult,
  UserFilters,
} from '../../../../types/user.types';
import { getApiError } from '../../../../utils/apiErrors';
import { accountText as t } from '../../../../utils/accountText';
export function useUsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    search: '',
    role: '',
    status: '',
  });
  const [result, setResult] = useState<AdminUsersResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [version, setVersion] = useState(0);
  const working = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setLoading(true);
      setError('');
      getAdminUsers(filters, controller.signal)
        .then((value) => {
          if (!controller.signal.aborted) setResult(value);
        })
        .catch((err) => {
          if (!controller.signal.aborted)
            setError(getApiError(err, t.usersError));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [filters, version]);
  async function update(user: AdminUser, active: boolean) {
    if (working.current) return;
    working.current = true;
    setSaving(true);
    setError('');
    try {
      await setUserActive(user.id, active);
      setTarget(null);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(getApiError(err, t.updateError));
    } finally {
      working.current = false;
      setSaving(false);
    }
  }
  return {
    filters,
    setFilters,
    result,
    loading,
    error,
    saving,
    target,
    setTarget,
    update,
    refresh: () => setVersion((v) => v + 1),
  };
}
