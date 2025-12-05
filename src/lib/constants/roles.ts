export enum UserRole {
  GUEST = "GUEST", // Not logged in
  USER = "USER", // Free tier
  PRO = "PRO", // Paid tier
}

export const ROLE_HIERARCHY = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.PRO]: 2,
};

export function hasRole(
  userRole: UserRole,
  requiredRole: UserRole | UserRole[]
): boolean {
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return required.some(
    (role) => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[role]
  );
}
