import { UserRole, hasRole } from "./constants/roles";
import { FEATURE_LIMITS } from "./constants/limits";
import prisma from "./prisma";

/**
 * Get user role from session
 */
export function getUserRole(user: { isPro?: boolean } | null): UserRole {
  if (!user) return UserRole.GUEST;
  return user.isPro ? UserRole.PRO : UserRole.USER;
}

/**
 * Check if user can access a feature
 */
export function canAccessFeature(
  userRole: UserRole,
  requiredRole: UserRole | UserRole[]
): boolean {
  return hasRole(userRole, requiredRole);
}

/**
 * Check if user has reached email quota
 */
export async function hasEmailQuota(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPro: true,
      emailQuota: true,
      emailsUsed: true,
      quotaResetAt: true,
    },
  });

  if (!user) return false;
  if (user.isPro) return true; // PRO has unlimited

  // Check if quota needs reset (monthly)
  const now = new Date();
  const resetDate = new Date(user.quotaResetAt);
  if (now > resetDate) {
    // Reset quota
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailsUsed: 0,
        quotaResetAt: new Date(now.setMonth(now.getMonth() + 1)),
      },
    });
    return true;
  }

  return user.emailsUsed < user.emailQuota;
}

/**
 * Increment email usage
 */
export async function incrementEmailUsage(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true },
  });

  if (user?.isPro) return; // PRO users don't count

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailsUsed: { increment: 1 },
    },
  });
}

/**
 * Log usage for analytics
 */
export async function logUsage(
  userId: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.usageLog.create({
    data: {
      userId,
      action,
      metadata: metadata || {},
    },
  });
}

/**
 * Check if professor is accessible to user
 */
export function canAccessProfessor(
  professor: { isPro: boolean },
  userRole: UserRole
): boolean {
  if (!professor.isPro) return true; // Public professors
  return userRole === UserRole.PRO;
}

/**
 * Get remaining email quota
 */
export async function getRemainingEmailQuota(
  userId: string
): Promise<number | "unlimited"> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPro: true,
      emailQuota: true,
      emailsUsed: true,
    },
  });

  if (!user) return 0;
  if (user.isPro) return "unlimited";

  return Math.max(0, user.emailQuota - user.emailsUsed);
}
