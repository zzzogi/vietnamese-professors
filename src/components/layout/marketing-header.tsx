"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";

export function MarketingHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-xl">Vietnamese Professors</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/professors"
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Browse Professors
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-purple-600 transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
