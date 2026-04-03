import { Skeleton } from "@/components/ui/Skeleton";

export default function ScholarshipsLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/10 p-6">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-4" />
              <div className="flex justify-between items-center pt-4 border-t border-black/5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
