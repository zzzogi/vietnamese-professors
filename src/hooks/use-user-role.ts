"use client";

import { useSession } from "next-auth/react";
import { UserRole, hasRole } from "@/lib/constants/roles";

export function useUserRole() {
  const { data: session, status } = useSession();

  const role = session?.user?.role || UserRole.GUEST;
  const isPro = session?.user?.isPro || false;
  const isGuest = role === UserRole.GUEST;
  const isUser = role === UserRole.USER;

  return {
    role,
    isPro,
    isGuest,
    isUser,
    isLoading: status === "loading",
    hasRole: (required: UserRole) => hasRole(role, required),
    session,
  };
}
