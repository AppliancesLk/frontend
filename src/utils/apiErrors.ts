import axios from 'axios';
import { translations } from './translations';
export function getApiError(
  error: unknown,
  fallback: string = translations.admin.saveError,
): string {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    if (error.response?.status === 401) return translations.auth.sessionExpired;
    if (error.response?.status === 403) return translations.auth.accessDenied;
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join('. ');
    if (typeof message === 'string' && (error.response?.status ?? 500) < 500)
      return message;
  }
  return fallback;
}
