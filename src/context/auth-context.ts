import { createContext } from 'react';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  UserRole,
} from '../types/auth.types';
export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signIn: (input: LoginInput) => Promise<AuthUser>;
  signUp: (input: RegisterInput) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
