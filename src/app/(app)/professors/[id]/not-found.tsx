import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <UserX className="h-24 w-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Professor Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The professor you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/professors">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Back to Professors List
          </Button>
        </Link>
      </div>
    </div>
  );
}
