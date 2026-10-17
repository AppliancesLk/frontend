import { USER_ROLES } from '../constants/roles';
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
export interface LoginInput {
  username: string;
  password: string;
}
export interface RegisterInput extends LoginInput {
  email: string;
}
