import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-purple-600 leading-none mb-4">
            404
          </h1>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
            <Search className="w-16 h-16 text-purple-600" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 min-w-[180px]"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/professors">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 min-w-[180px]"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Professors
            </Button>
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/professors"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
            >
              Professor Directory
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/leaderboard"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
            >
              Leaderboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/dashboard"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
