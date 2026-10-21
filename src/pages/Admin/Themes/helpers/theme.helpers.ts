import type {
  SeasonalTheme,
  SeasonalThemeSettings,
  UpdateSeasonalTheme,
} from '../../../../types/seasonal-theme.types';
import { seasonalText } from '../../../../utils/seasonalText';
export interface ThemeDraft {
  theme: SeasonalTheme;
  headline: string;
  message: string;
  showGreeting: boolean;
  decorations: boolean;
  animations: boolean;
  timing: 'NOW' | 'SCHEDULED';
  startsAt: string;
  endsAt: string;
}
export function colomboLocal(iso: string | null): string {
  if (!iso) return '';
  return new Date(Date.parse(iso) + 330 * 60_000).toISOString().slice(0, 16);
}
export function colomboIso(value: string): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error(seasonalText.invalidDates);
  const date = new Date(`${value}:00+05:30`);
  if (
    !Number.isFinite(date.getTime()) ||
    colomboLocal(date.toISOString()) !== value
  )
    throw new Error(seasonalText.invalidDates);
  return date.toISOString();
}
export function themeDraft(settings: SeasonalThemeSettings): ThemeDraft {
  return {
    theme: settings.theme,
    headline: settings.headline,
    message: settings.message,
    showGreeting: settings.showGreeting,
    decorations: settings.decorations,
    animations: settings.animations,
    timing: settings.startsAt ? 'SCHEDULED' : 'NOW',
    startsAt: colomboLocal(settings.startsAt),
    endsAt: colomboLocal(settings.endsAt),
  };
}
export function themeUpdate(
  draft: ThemeDraft,
  version: number,
  now = Date.now(),
): UpdateSeasonalTheme {
  if (draft.theme === 'DEFAULT')
    return {
      theme: 'DEFAULT',
      headline: '',
      message: '',
      showGreeting: true,
      decorations: true,
      animations: true,
      startsAt: null,
      endsAt: null,
      version,
    };
  const startsAt =
    draft.timing === 'SCHEDULED' ? colomboIso(draft.startsAt) : null;
  const endsAt = colomboIso(draft.endsAt);
  if (
    (draft.timing === 'SCHEDULED' && !startsAt) ||
    (endsAt && Date.parse(endsAt) <= now) ||
    (startsAt && endsAt && Date.parse(endsAt) <= Date.parse(startsAt))
  )
    throw new Error(seasonalText.invalidDates);
  return {
    theme: draft.theme,
    headline: draft.headline.trim(),
    message: draft.message.trim(),
    showGreeting: draft.showGreeting,
    decorations: draft.decorations,
    animations: draft.animations,
    startsAt,
    endsAt,
    version,
  };
}
