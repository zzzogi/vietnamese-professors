import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          </Card>
        ))}
      </div>

      {/* Section skeleton */}
      {[...Array(3)].map((_, sectionIdx) => (
        <div key={sectionIdx}>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, cardIdx) => (
              <Card key={cardIdx} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
