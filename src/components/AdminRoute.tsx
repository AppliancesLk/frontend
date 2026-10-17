import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

// TODO(auth): placeholder until the frontend auth foundation (issue #4) lands.
// Replace the body with useAuth(): wait for isLoading, redirect to /login when
// unauthenticated, and show access denied when user.role !== 'ADMIN'.
// The backend still enforces 401/403 on every stock request.
function AdminRoute({ children }: AdminRouteProps) {
  return <>{children}</>;
}

export default AdminRoute;
