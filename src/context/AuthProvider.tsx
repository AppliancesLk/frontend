import { translations } from '../utils/translations';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import apiClient from '../api/apiClient';
import * as authService from '../services/authService';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  UserRole,
} from '../types/auth.types';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const refresh = useCallback(async (background = false) => {
    const current = ++generation.current;
    if (!background) setLoading(true);
    setError(null);
    try {
      const profile = await authService.getProfile();
      if (current === generation.current) setUser(profile);
    } catch (err) {
      if (current !== generation.current) return;
      setUser(null);
      if (!axios.isAxiosError(err) || err.response?.status !== 401)
        setError(translations.auth.sessionError);
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Restore server-managed session state when the provider mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const id = apiClient.interceptors.response.use(
      (response) => response,
      (err) => {
        if (
          err.response?.status === 401 &&
          !err.config?.url?.match(/auth\/(login|register|profile)/)
        ) {
          generation.current++;
          setLoading(false);
          setUser(null);
        }
        return Promise.reject(err);
      },
    );
    const onFocus = () => {
      void refresh(true);
    };
    window.addEventListener('focus', onFocus);
    return () => {
      apiClient.interceptors.response.eject(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [refresh]);

  async function signIn(input: LoginInput) {
    generation.current++;
    setUser(await authService.login(input));
    setError(null);
  }
  async function signUp(input: RegisterInput) {
    generation.current++;
    setUser(await authService.register(input));
    setError(null);
  }
  async function signOut() {
    await authService.logout();
    generation.current++;
    setUser(null);
  }
  function hasRole(...roles: UserRole[]) {
    return !!user && roles.includes(user.role);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refresh,
        signIn,
        signUp,
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
