import { useContext } from 'react';
import { SeasonalThemeContext } from '../context/seasonal-theme-context';
export const useSeasonalTheme = () => useContext(SeasonalThemeContext);
