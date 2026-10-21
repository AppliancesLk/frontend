import apiClient from '../api/apiClient';
import type {
  ActiveSeasonalTheme,
  SeasonalThemeSettings,
  UpdateSeasonalTheme,
} from '../types/seasonal-theme.types';
export const getActiveSeasonalTheme = async (signal?: AbortSignal) =>
  (
    await apiClient.get<ActiveSeasonalTheme>('/storefront-theme', {
      signal,
      timeout: 8_000,
    })
  ).data;
export const getSeasonalThemeSettings = async (signal?: AbortSignal) =>
  (
    await apiClient.get<SeasonalThemeSettings>('/storefront-theme/admin', {
      signal,
    })
  ).data;
export const updateSeasonalTheme = async (input: UpdateSeasonalTheme) =>
  (await apiClient.put<SeasonalThemeSettings>('/storefront-theme/admin', input))
    .data;
