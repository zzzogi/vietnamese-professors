import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Trophy } from "lucide-react";
import Link from "next/link";

export function DemoPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
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
          <Card className="relative overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 p-6">
              <div className="bg-white rounded-lg p-4 blur-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  AI Email Generator
                </h3>
                <p className="mb-4">Sign up to unlock full access</p>
                <Link href="/register">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="relative overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 p-6">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">
                      {i}
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
                <div className="bg-white rounded-lg p-3 blur-sm">
                  <div className="h-3 bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Professor Leaderboard
                </h3>
                <p className="mb-4">Login to see full rankings</p>
                <Link href="/login">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
