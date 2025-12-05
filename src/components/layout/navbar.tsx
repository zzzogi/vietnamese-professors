"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/professors", label: "Browse Professors" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileNav />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">
              Vietnamese Professors
            </span>
            <span className="font-bold text-lg sm:hidden">VP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-600",
                  pathname === link.href ? "text-purple-600" : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon (hidden on mobile) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link href="/professors">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {/* Auth Section */}
            {status === "loading" ? (
              <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-md" />
            ) : session ? (
              <>
                <Link href="/dashboard" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <span className="hidden sm:inline">Start Free</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
