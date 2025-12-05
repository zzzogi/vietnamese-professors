"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function CtaBanner() {
  const { data: session } = useSession();

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect with Top Professors?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join hundreds of students finding their ideal research supervisors
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <>
                <Link href="/professors">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-base px-8 h-12 min-w-[180px] shadow-lg"
                  >
                    Browse Professors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 text-base px-8 h-12 min-w-[180px]"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-base px-8 h-12 min-w-[180px] shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/professors">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 text-base px-8 h-12 min-w-[180px]"
                  >
                    Browse Professors
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-purple-100">
            No credit card required • Start in seconds • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
