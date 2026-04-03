import { Skeleton } from "@/components/ui/Skeleton";

export default function FlightsLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Widget placeholder */}
        <div className="bg-white rounded-xl border border-black/10 p-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Enquiry form */}
        <div className="bg-white rounded-xl border border-black/10 p-8">
          <Skeleton className="h-6 w-52 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-40 rounded-lg mt-6" />
        </div>
      </div>
    </div>
  );
}
