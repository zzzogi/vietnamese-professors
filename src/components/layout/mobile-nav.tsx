"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, GraduationCap, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/use-user-role";

const navLinks = [
  { href: "/professors", label: "Browse Professors" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isPro } = useUserRole();

  const user = session?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0].toUpperCase() ||
    "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Vietnamese Professors</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-8">
          {/* User Info (if logged in) */}
          {session && user && (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || ""}
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  {isPro && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-600">
                        PRO Member
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}

            {session && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/dashboard"
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/settings"
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Settings
                </Link>
              </>
            )}
          </nav>

          <Separator />

          {/* Auth Actions */}
          {session ? (
            <div className="space-y-2">
              {!isPro && (
                <Link href="/pricing" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to PRO
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Free
                </Button>
              </Link>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
