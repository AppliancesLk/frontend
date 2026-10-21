import { createContext } from 'react';
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  RegistrationResult,
  UserRole,
} from '../types/auth.types';
export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signIn: (input: LoginInput) => Promise<AuthUser>;
  signUp: (input: RegisterInput) => Promise<RegistrationResult>;
  signOut: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
