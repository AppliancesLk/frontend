import { USER_ROLES } from '../constants/roles';
import type { ReactNode } from 'react';
import { ProtectedRoute } from './auth/ProtectedRoute';

function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute roles={[USER_ROLES.ADMIN]}>{children}</ProtectedRoute>;
}
export default AdminRoute;
