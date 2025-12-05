import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect with Top Vietnamese Professors?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join hundreds of students finding their ideal research supervisors
            and mentors
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/professors">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8"
              >
                Browse Professors
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-purple-100">
            No credit card required • 5 free profiles • Start in seconds
          </p>
        </div>
      </div>
    </section>
  );
}
