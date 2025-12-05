export enum UserRole {
  GUEST = "GUEST",
  USER = "USER",
  PRO = "PRO",
}

export const ROLE_HIERARCHY = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.PRO]: 2,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
