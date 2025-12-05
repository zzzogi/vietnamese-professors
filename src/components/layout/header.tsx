"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Navbar } from "./navbar";
import { MobileNav } from "./mobile-nav";
import { useMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useMobile(768);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          {isMobile && <MobileNav />}

          {/* Logo (always visible) */}
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
          {!isMobile && <Navbar />}
        </div>
      </div>
    </header>
  );
}
