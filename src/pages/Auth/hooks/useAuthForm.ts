import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getAuthDestination } from '../helpers/auth.helpers';
import { translations } from '../../../utils/translations';
import { ROUTES } from '../../../constants/routes';

export function useAuthForm(mode: 'login' | 'register') {
  const registering = mode === 'register';
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const requested = (location.state as { from?: string } | null)?.from;
  const destination = getAuthDestination(user, requested);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (registering && password !== confirm) {
      setError(translations.auth.passwordMismatch);
      return;
    }
    setBusy(true);
    try {
      if (registering) await signUp({ username, email, password });
      else await signIn({ username, password });
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;
      setError(
        Array.isArray(message)
          ? message.join('. ')
          : typeof message === 'string'
            ? message
            : translations.auth.connectionError,
      );
    } finally {
      setBusy(false);
    }
  }

  return {
    registering,
    user,
    loading,
    location,
    destination,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    busy,
    error,
    submit,
  };
}
