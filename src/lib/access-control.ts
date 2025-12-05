import { FEATURE_LIMITS } from "@/lib/constants/limits";
import { UserRole } from "@/lib/constants/roles";
import prisma from "@/lib/prisma";

export function getUserRole(user?: any): UserRole {
  if (!user) return UserRole.GUEST;
  return (user.role as UserRole) || UserRole.USER;
}

// ✅ Check if user has email quota remaining
export async function hasEmailQuota(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      emailQuota: true,
      emailsUsed: true,
      quotaResetAt: true,
    },
  });

  if (!user) return false;

  const userRole = user.role as UserRole;
  const limit = FEATURE_LIMITS[userRole].emailGeneration;

  // PRO has unlimited
  if (limit === Infinity) return true;

  // Check if quota needs reset (monthly)
  const now = new Date();
  if (user.quotaResetAt && user.quotaResetAt < now) {
    // Reset quota
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailsUsed: 0,
        quotaResetAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
      },
    });
    return true;
  }

  return user.emailsUsed < user.emailQuota;
}

// ✅ Increment email usage count
export async function incrementEmailUsage(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailsUsed: { increment: 1 },
    },
  });
}

// ✅ Get remaining quota
export async function getRemainingQuota(userId: string): Promise<{
  used: number;
  total: number;
  remaining: number;
  resetAt: Date | null;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      emailQuota: true,
      emailsUsed: true,
      quotaResetAt: true,
    },
  });

  if (!user) {
    return { used: 0, total: 0, remaining: 0, resetAt: null };
  }

  const userRole = user.role as UserRole;
  const total = FEATURE_LIMITS[userRole].emailGeneration;
  const used = user.emailsUsed;
  const remaining = total === Infinity ? Infinity : Math.max(0, total - used);

  return {
    used,
    total: total === Infinity ? -1 : total, // -1 represents unlimited
    remaining: remaining === Infinity ? -1 : remaining,
    resetAt: user.quotaResetAt,
  };
}

// ✅ Log user actions for analytics
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

// ✅ Check professor view limit
export async function canViewProfessor(
  userId: string | null,
  professorIndex: number
): Promise<boolean> {
  if (!userId) {
    // Guest user - limited to 5
    return professorIndex < FEATURE_LIMITS[UserRole.GUEST].professorViews;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return false;

  const userRole = user.role as UserRole;
  const limit = FEATURE_LIMITS[userRole].professorViews;

  return limit === Infinity || professorIndex < limit;
}

// ✅ Reset quota for all users (run daily via cron)
export async function resetExpiredQuotas(): Promise<void> {
  const now = new Date();

  await prisma.user.updateMany({
    where: {
      quotaResetAt: {
        lt: now,
      },
    },
    data: {
      emailsUsed: 0,
      quotaResetAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}
