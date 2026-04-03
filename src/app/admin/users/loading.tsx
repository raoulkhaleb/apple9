import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-36 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-[#f8faf9] border-b border-black/10">
          {["User", "Joined", "Applications", "Role"].map((col) => (
            <Skeleton key={col} className="h-4 w-20" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-black/5 items-center">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
