import { useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from '../../../../services/authService';
import { getApiError } from '../../../../utils/apiErrors';
import { accountText as t } from '../../../../utils/accountText';
import { useAuth } from '../../../../hooks/useAuth';

export type AccountActionMode = 'verify' | 'forgot' | 'reset';
export function useAccountAction(mode: AccountActionMode) {
  const { refresh } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    email?: string;
    message?: string;
    completed?: boolean;
  } | null;
  const [email, setEmail] = useState(state?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const token = new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
  const [message, setMessage] = useState(state?.message ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(state?.completed ?? false);
  const working = useRef(false);
  async function run(
    action: () => Promise<{ message: string }>,
    finish: boolean,
  ) {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await action();
      if (mode === 'reset' && finish) await refresh();
      setMessage(result.message);
      if (finish) {
        setCompleted(true);
        navigate(location.pathname, {
          replace: true,
          state: { message: result.message, completed: true },
        });
      }
    } catch (err) {
      setError(getApiError(err, t.error));
    } finally {
      working.current = false;
      setBusy(false);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === 'reset' && password !== confirm) {
      setError(t.mismatch);
      return;
    }
    if (mode === 'verify' && /^[a-f0-9]{64}$/.test(token))
      return run(() => verifyEmail(token), true);
    if (mode === 'reset')
      return run(() => resetPassword(token, password), true);
    return run(
      () =>
        mode === 'verify' ? resendVerification(email) : forgotPassword(email),
      false,
    );
  }
  return {
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    token,
    message,
    error,
    busy,
    completed,
    submit,
  };
}
