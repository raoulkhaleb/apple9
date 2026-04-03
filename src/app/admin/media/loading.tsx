import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminMediaLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-52 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      {/* Partnership cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-black/10 p-5">
            <div className="flex justify-between items-start mb-3">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2 pt-3 border-t border-black/5">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
