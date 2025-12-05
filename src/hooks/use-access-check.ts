"use client";

import { useUserRole } from "./use-user-role";
import { UserRole } from "@/lib/constants/roles";
import { canAccessFeature } from "@/lib/access-control";

export function useAccessCheck(required: UserRole | UserRole[]) {
  const { role, isLoading } = useUserRole();

  const hasAccess = canAccessFeature(role, required);

  return {
    hasAccess,
    isLoading,
    role,
  };
}
