import type { UserRole } from './auth.types';
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  deactivatedAt: string | null;
  loyaltyBalance: string;
  createdAt: string;
}
export interface UserFilters {
  page: number;
  search: string;
  role: UserRole | '';
  status: 'active' | 'inactive' | 'pending' | '';
}
export interface AdminUsersResult {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}
