import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-[#f8faf9] border-b border-black/10">
          {["Applicant", "College", "Submitted", "Payment", "Status"].map((col) => (
            <Skeleton key={col} className="h-4 w-20" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-black/5 items-center">
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
