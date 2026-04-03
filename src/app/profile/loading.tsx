import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-36 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-32 rounded-lg mt-6" />
        </div>

        {/* Applications card */}
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-black/5">
                <div>
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
