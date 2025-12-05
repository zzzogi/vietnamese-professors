import { UserRole } from "@/lib/constants/roles";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
      isPro: boolean;
      emailQuota: number;
      emailsUsed: number;
      proExpiresAt?: Date | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
    isPro: boolean;
    emailQuota: number;
    emailsUsed: number;
    proExpiresAt?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    isPro: boolean;
    emailQuota: number;
    emailsUsed: number;
    proExpiresAt?: Date | null;
  }
}
