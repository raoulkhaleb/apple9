import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminFinanceLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-44 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Revenue summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-black/10 p-5">
            <Skeleton className="h-4 w-36 mb-3" />
            <Skeleton className="h-8 w-28 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-black/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-[#f8faf9] border-b border-black/10">
          {["User", "Type", "Amount", "Date", "Status"].map((col) => (
            <Skeleton key={col} className="h-4 w-20" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-black/5 items-center">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
