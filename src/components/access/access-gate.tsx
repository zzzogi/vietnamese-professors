"use client";

import { useSession } from "next-auth/react";
import { UserRole, hasRole } from "@/lib/constants/roles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Crown, LogIn } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AccessGateProps {
  required: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function AccessGate({
  required,
  children,
  fallback,
  showUpgrade = true,
}: AccessGateProps) {
  const { data: session, status } = useSession();

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const userRole = session?.user?.role || UserRole.GUEST;

  // Check if user has required role
  if (hasRole(userRole, required)) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback based on required role
  if (required === UserRole.USER) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <LogIn className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Sign In Required
        </h3>
        <p className="text-gray-600 mb-6">
          Please sign in to access this feature
        </p>
        <Link href="/login">
          <Button className="bg-purple-600 hover:bg-purple-700">Sign In</Button>
        </Link>
      </Card>
    );
  }

  if (required === UserRole.PRO) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <Crown className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          PRO Feature
        </h3>
        <p className="text-gray-600 mb-6">
          This feature is available for PRO members only
        </p>
        {showUpgrade && (
          <div className="flex gap-3 justify-center">
            <Link href="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to PRO
              </Button>
            </Link>
            {userRole === UserRole.GUEST && (
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </Card>
    );
  }

  // Generic locked state
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <Lock className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Access Restricted
      </h3>
      <p className="text-gray-600">
        You don't have permission to access this feature
      </p>
    </Card>
  );
}
