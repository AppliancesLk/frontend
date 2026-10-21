export const SEASONAL_THEMES = [
  'DEFAULT',
  'AVURUDU',
  'CHRISTMAS',
  'HALLOWEEN',
  'EASTER',
] as const;
export type SeasonalTheme = (typeof SEASONAL_THEMES)[number];
export interface ActiveSeasonalTheme {
  theme: SeasonalTheme;
  headline: string;
  message: string;
  showGreeting: boolean;
  decorations: boolean;
  animations: boolean;
  nextChangeAt: string | null;
  serverTime: string;
}
export interface SeasonalThemeSettings {
  theme: SeasonalTheme;
  headline: string;
  message: string;
  showGreeting: boolean;
  decorations: boolean;
  animations: boolean;
  startsAt: string | null;
  endsAt: string | null;
  version: number;
  updatedAt: string;
  active: ActiveSeasonalTheme;
}
export type UpdateSeasonalTheme = Pick<
  SeasonalThemeSettings,
  | 'theme'
  | 'headline'
  | 'message'
  | 'showGreeting'
  | 'decorations'
  | 'animations'
  | 'startsAt'
  | 'endsAt'
  | 'version'
>;
export const DEFAULT_SEASONAL_THEME: ActiveSeasonalTheme = {
  theme: 'DEFAULT',
  headline: '',
  message: '',
  showGreeting: false,
  decorations: false,
  animations: false,
  nextChangeAt: null,
  serverTime: '',
};
