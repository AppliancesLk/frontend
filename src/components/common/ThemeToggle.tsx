import { useSyncExternalStore } from 'react';

type Theme = 'system' | 'light' | 'dark';
const subscribe = (callback: () => void) => {
  window.addEventListener('al-theme-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('al-theme-change', callback);
    window.removeEventListener('storage', callback);
  };
};
function getTheme(): Theme {
  try {
    const saved = localStorage.getItem('al-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    const applied = document.documentElement.getAttribute('data-theme');
    return applied === 'dark' || applied === 'light' ? applied : 'system';
  }
}
export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => 'system' as const,
  );
  function choose(next: Theme) {
    if (next === 'system')
      document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('al-theme', next);
    } catch {
      /* Theme still applies for this visit. */
    }
    window.dispatchEvent(new Event('al-theme-change'));
  }
  return (
    <div className="theme-control" role="group" aria-label="Color theme">
      {(['system', 'light', 'dark'] as const).map((option) => (
        <button
          type="button"
          key={option}
          aria-pressed={theme === option}
          onClick={() => choose(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}
