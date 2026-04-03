import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminMessagesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-52 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="bg-white rounded-xl border border-black/10 p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-5">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-40 rounded-lg mt-6" />
      </div>
    </div>
  );
}
