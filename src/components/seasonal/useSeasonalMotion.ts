import { useEffect, useRef, useState } from 'react';

type DataConnection = EventTarget & { saveData?: boolean };
const pauseKey = 'al-season-effects-paused';
function savedPause() {
  try {
    return sessionStorage.getItem(pauseKey) === 'true';
  } catch {
    return false;
  }
}

export function useSeasonalMotion(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(savedPause);
  const [visible, setVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & { connection?: DataConnection }
    ).connection;
    const preferences = () =>
      setAllowed(!media.matches && !connection?.saveData);
    const visibility = () => {
      if (document.hidden) setVisible(false);
      else if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setVisible(rect.bottom > 0 && rect.top < innerHeight);
      }
    };
    preferences();
    visibility();
    media.addEventListener('change', preferences);
    connection?.addEventListener('change', preferences);
    document.addEventListener('visibilitychange', visibility);
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) =>
            setVisible(entry.isIntersecting && !document.hidden),
          );
    if (ref.current) observer?.observe(ref.current);
    return () => {
      observer?.disconnect();
      media.removeEventListener('change', preferences);
      connection?.removeEventListener('change', preferences);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled]);
  function toggle() {
    const next = !paused;
    setPaused(next);
    try {
      sessionStorage.setItem(pauseKey, String(next));
    } catch {
      /* Pause still works for this page. */
    }
  }
  return {
    ref,
    running: enabled && allowed && visible && !paused,
    controllable: enabled && allowed,
    paused,
    toggle,
  };
}
