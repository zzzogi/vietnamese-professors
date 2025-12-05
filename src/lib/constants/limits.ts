import { UserRole } from "./roles";

export const FEATURE_LIMITS = {
  [UserRole.GUEST]: {
    professorViews: 5, // Can view 5 full professor profiles
    emailGeneration: 0, // Cannot generate emails
    leaderboardView: 5, // Can see top 5 only
    bookmarks: 0, // Cannot bookmark
    exportData: false,
    viewProProfessors: false,
  },
  [UserRole.USER]: {
    professorViews: Infinity, // Unlimited views
    emailGeneration: 10, // 10 emails per month
    leaderboardView: Infinity,
    bookmarks: Infinity,
    exportData: false,
    viewProProfessors: false,
  },
  [UserRole.PRO]: {
    professorViews: Infinity,
    emailGeneration: Infinity,
    leaderboardView: Infinity,
    bookmarks: Infinity,
    exportData: true,
    viewProProfessors: true,
  },
};

export function getFeatureLimit(
  role: UserRole,
  feature: keyof typeof FEATURE_LIMITS.USER
) {
  return FEATURE_LIMITS[role][feature];
}
