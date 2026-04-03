import { Skeleton } from "@/components/ui/Skeleton";

export default function MessagesLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-black/10">
          <Skeleton className="h-9 w-20 rounded-t-lg" />
          <Skeleton className="h-9 w-16 rounded-t-lg" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/10 p-4 flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
