import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getActiveSeasonalTheme } from '../services/seasonalThemeService';
import {
  DEFAULT_SEASONAL_THEME,
  SEASONAL_THEMES,
  type ActiveSeasonalTheme,
} from '../types/seasonal-theme.types';
import { SeasonalThemeContext } from './seasonal-theme-context';

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(DEFAULT_SEASONAL_THEME);
  const request = useRef<AbortController | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const expiry = useRef<number | undefined>(undefined);
  const alive = useRef(false);
  const load = useCallback(async function fetchTheme() {
    request.current?.abort();
    window.clearTimeout(timer.current);
    const controller = new AbortController();
    request.current = controller;
    const requestedAt = performance.now();
    let next: ActiveSeasonalTheme = DEFAULT_SEASONAL_THEME;
    try {
      const result = await getActiveSeasonalTheme(controller.signal);
      if (SEASONAL_THEMES.includes(result.theme)) next = result;
    } catch {
      /* Seasonal styling is optional; the store keeps its default appearance. */
    }
    if (!alive.current || controller.signal.aborted) return;
    window.clearTimeout(expiry.current);
    setActive(next);
    if (next.theme === 'DEFAULT')
      document.documentElement.removeAttribute('data-season');
    else document.documentElement.setAttribute('data-season', next.theme);
    const transition = next.nextChangeAt
      ? Date.parse(next.nextChangeAt) -
        Date.parse(next.serverTime) -
        (performance.now() - requestedAt)
      : 60_000;
    // A known end date must still restore Default if the next API request stalls.
    if (
      next.theme !== 'DEFAULT' &&
      next.nextChangeAt &&
      Number.isFinite(transition)
    ) {
      const deadline = performance.now() + Math.max(0, transition);
      const expire = () => {
        if (!alive.current) return;
        const remaining = deadline - performance.now();
        if (remaining > 0) {
          expiry.current = window.setTimeout(
            expire,
            Math.min(remaining, 2_147_483_647),
          );
          return;
        }
        setActive(DEFAULT_SEASONAL_THEME);
        document.documentElement.removeAttribute('data-season');
      };
      expire();
    }
    const delay = Number.isFinite(transition)
      ? Math.max(250, Math.min(60_000, transition + 100))
      : 60_000;
    timer.current = window.setTimeout(() => {
      if (document.visibilityState === 'visible') void fetchTheme();
    }, delay);
  }, []);
  useEffect(() => {
    alive.current = true;
    void load();
    const focus = () => {
      if (document.visibilityState === 'visible') void load();
    };
    window.addEventListener('focus', focus);
    document.addEventListener('visibilitychange', focus);
    return () => {
      alive.current = false;
      request.current?.abort();
      window.clearTimeout(timer.current);
      window.clearTimeout(expiry.current);
      window.removeEventListener('focus', focus);
      document.removeEventListener('visibilitychange', focus);
      document.documentElement.removeAttribute('data-season');
    };
  }, [load]);
  return (
    <SeasonalThemeContext.Provider value={{ active, refresh: load }}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}
