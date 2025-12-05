"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Trophy, Mail } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function DemoPreview() {
  const { data: session } = useSession();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600">
            Get a preview of our powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Generator Preview */}
          <Card className="relative overflow-hidden border-gray-200">
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-blue-50 p-8">
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <div className="h-3 bg-purple-200 rounded w-32" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="pt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </div>

            {/* ✅ Conditional Overlay - only show if not logged in */}
            {!session && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI Email Generator
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sign up to unlock full access
                  </p>
                  <Link href="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Start Free
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* Leaderboard Preview */}
          <Card className="relative overflow-hidden border-gray-200">
            <div className="aspect-[4/3] bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-gray-900">
                      {i}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 bg-yellow-200 rounded w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Always show overlay for leaderboard (requires login) */}
            {!session && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Professor Leaderboard
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sign in to see full rankings
                  </p>
                  <Link href="/login">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
