import type { AuthUser } from '../../../types/auth.types';
import { ROUTES } from '../../../constants/routes';
import { USER_ROLES } from '../../../constants/roles';
export function getAuthDestination(
  user: AuthUser | null,
  requested?: string,
): string {
  const home =
    user?.role === USER_ROLES.ADMIN
      ? ROUTES.admin
      : user?.role === USER_ROLES.REPAIRER
        ? ROUTES.repairer
        : ROUTES.account;
  if (
    !requested ||
    !requested.startsWith('/') ||
    requested.startsWith('//') ||
    requested.includes('\\') ||
    /^\/(login|register)(?:[/?#]|$)/.test(requested)
  )
    return home;
  // An admin signing in from a customer page should land in the admin dashboard.
  if (user?.role === USER_ROLES.ADMIN && !/^\/admin(?:[/?#]|$)/.test(requested))
    return home;
  if (/^\/admin(?:[/?#]|$)/.test(requested) && user?.role !== USER_ROLES.ADMIN)
    return home;
  if (
    /^\/repairer(?:[/?#]|$)/.test(requested) &&
    user?.role !== USER_ROLES.REPAIRER
  )
    return home;
  return requested;
}
