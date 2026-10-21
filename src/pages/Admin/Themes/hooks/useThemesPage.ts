import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSeasonalThemeSettings,
  updateSeasonalTheme,
} from '../../../../services/seasonalThemeService';
import { useSeasonalTheme } from '../../../../hooks/useSeasonalTheme';
import type { SeasonalThemeSettings } from '../../../../types/seasonal-theme.types';
import { getApiError } from '../../../../utils/apiErrors';
import { seasonalText as t } from '../../../../utils/seasonalText';
import {
  themeDraft,
  themeUpdate,
  type ThemeDraft,
} from '../helpers/theme.helpers';

export function useThemesPage() {
  const { active, refresh: refreshStore } = useSeasonalTheme();
  const [settings, setSettings] = useState<SeasonalThemeSettings | null>(null);
  const [draft, setDraft] = useState<ThemeDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [version, setVersion] = useState(0);
  const [darkPreview, setDarkPreview] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(false);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await getSeasonalThemeSettings(controller.signal);
        if (!controller.signal.aborted) {
          setSettings(result);
          setDraft(themeDraft(result));
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(getApiError(err, t.loadError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [version]);
  async function save(reset = false) {
    if (busy.current || !settings || !draft) return;
    busy.current = true;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const input = themeUpdate(
        reset ? { ...draft, theme: 'DEFAULT' } : draft,
        settings.version,
      );
      const result = await updateSeasonalTheme(input);
      await refreshStore();
      if (mounted.current) {
        setSettings(result);
        setDraft(themeDraft(result));
        setConfirmReset(false);
        setSuccess(
          result.startsAt && result.active.theme === 'DEFAULT'
            ? t.scheduled
            : t.saved,
        );
      }
    } catch (err) {
      if (mounted.current)
        setError(
          err instanceof Error && err.message === t.invalidDates
            ? err.message
            : getApiError(err, t.saveError),
        );
    } finally {
      busy.current = false;
      if (mounted.current) setSaving(false);
    }
  }
  return {
    active,
    settings,
    draft,
    setDraft,
    loading,
    saving,
    error,
    success,
    reload,
    save,
    darkPreview,
    setDarkPreview,
    confirmReset,
    setConfirmReset,
  };
}
