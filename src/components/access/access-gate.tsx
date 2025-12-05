"use client";

import { ReactNode } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole, hasRole } from "@/lib/constants/roles";
import { UpgradeModal } from "./upgrade-modal";
import { useState } from "react";

interface AccessGateProps {
  /**
   * Required role(s) to access the content
   */
  required: UserRole | UserRole[];

  /**
   * Content to show when user has access
   */
  children: ReactNode;

  /**
   * Optional fallback to show when access is denied
   * If not provided and showUpgradeModal is false, nothing is rendered
   */
  fallback?: ReactNode;

  /**
   * Show upgrade modal when access is denied
   */
  showUpgradeModal?: boolean;

  /**
   * Feature name to display in upgrade modal
   */
  featureName?: string;
}

/**
 * AccessGate - Conditionally render content based on user role
 *
 * @example
 * // Show content only to PRO users
 * <AccessGate required="PRO" showUpgradeModal featureName="Exclusive Professors">
 *   <ProProfessorList />
 * </AccessGate>
 *
 * @example
 * // Show content to USER or PRO, hide from GUEST
 * <AccessGate required={["USER", "PRO"]} fallback={<LoginPrompt />}>
 *   <GenerateEmailButton />
 * </AccessGate>
 */
export function AccessGate({
  required,
  children,
  fallback,
  showUpgradeModal = false,
  featureName,
}: AccessGateProps) {
  const { role, isLoading } = useUserRole();
  const [showModal, setShowModal] = useState(false);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  const hasAccess = hasRole(role, required);

  // User has access - render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access
  if (showUpgradeModal) {
    return (
      <>
        <div onClick={() => setShowModal(true)} className="cursor-pointer">
          {fallback}
        </div>
        <UpgradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          feature={featureName}
        />
      </>
    );
  }

  // Just show fallback
  return <>{fallback}</>;
}
