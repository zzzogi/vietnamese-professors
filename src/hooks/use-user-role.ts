"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/constants/roles";

export function useUserRole(): {
  role: UserRole;
  isLoading: boolean;
  isPro: boolean;
  isGuest: boolean;
} {
  const { data: session, status } = useSession();

  const role = !session
    ? UserRole.GUEST
    : (session.user as any)?.isPro
    ? UserRole.PRO
    : UserRole.USER;

  return {
    role,
    isLoading: status === "loading",
    isPro: role === UserRole.PRO,
    isGuest: role === UserRole.GUEST,
  };
}
