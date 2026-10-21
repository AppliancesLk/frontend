import apiClient from '../api/apiClient';
import type {
  AdminUser,
  AdminUsersResult,
  UserFilters,
} from '../types/user.types';
export const getAdminUsers = async (
  filters: UserFilters,
  signal?: AbortSignal,
) =>
  (
    await apiClient.get<AdminUsersResult>('/admin/users', {
      signal,
      params: {
        ...filters,
        role: filters.role || undefined,
        status: filters.status || undefined,
        limit: 20,
      },
    })
  ).data;
export const setUserActive = async (id: string, isActive: boolean) =>
  (
    await apiClient.patch<AdminUser>(
      `/admin/users/${encodeURIComponent(id)}/active`,
      { isActive },
    )
  ).data;
