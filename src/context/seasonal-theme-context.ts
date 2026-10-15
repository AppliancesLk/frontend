import { createContext } from 'react';
import {
  DEFAULT_SEASONAL_THEME,
  type ActiveSeasonalTheme,
} from '../types/seasonal-theme.types';
export const SeasonalThemeContext = createContext<{
  active: ActiveSeasonalTheme;
  refresh: () => Promise<void>;
}>({ active: DEFAULT_SEASONAL_THEME, refresh: async () => {} });
