"use client";

import { useEffect } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { BookmarkedProfessorCard } from "@/components/dashboard/bookmarked-professor-card";
import { EmailDraftCard } from "@/components/dashboard/email-draft-card";
import { SuggestedProfessorCard } from "@/components/dashboard/suggested-professor-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Mail, TrendingUp, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AccessGate } from "@/components/access/access-gate";
import { UserRole } from "@/lib/constants/roles";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading, isError } = useDashboard();

  // ✅ FIX: Redirect trong useEffect thay vì trong render
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Failed to load dashboard</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const { bookmarks, recentEmails, suggestions, stats } = data!;

  return (
    <AccessGate required={UserRole.USER}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              👋 Welcome back, {session?.user?.name || "there"}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your professor connections
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bookmarks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalBookmarks}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalEmails}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ratings Given</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRatings}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookmarked Professors */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-yellow-500" />
                Your Bookmarked Professors
              </h2>
              {bookmarks.length > 0 && (
                <Link href="/professors">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {bookmarks.length === 0 ? (
              <Card className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start bookmarking professors you're interested in
                </p>
                <Link href="/professors">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Browse Professors
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((bookmark) => (
                  <BookmarkedProfessorCard
                    key={bookmark.id}
                    professor={bookmark.professor}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Recent Email Drafts */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-6 h-6 text-purple-500" />
                Recent Email Drafts
              </h2>
              {recentEmails.length > 0 && (
                <Link href="/dashboard/emails">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {recentEmails.length === 0 ? (
              <Card className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No saved emails yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Generate and save email drafts to professors
                </p>
                <Link href="/professors">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Generate Email
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentEmails.map((email) => (
                  <EmailDraftCard key={email.id} email={email} />
                ))}
              </div>
            )}
          </section>

          {/* Smart Suggestions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  Smart Suggestions for You
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your interests and bookmarks
                </p>
              </div>
            </div>

            {suggestions.length === 0 ? (
              <Card className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No suggestions yet
                </h3>
                <p className="text-gray-600">
                  Bookmark some professors to get personalized recommendations
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion) => (
                  <SuggestedProfessorCard
                    key={suggestion.professor.id}
                    professor={suggestion.professor}
                    reason={suggestion.reason}
                    score={suggestion.score}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AccessGate>
  );
}
