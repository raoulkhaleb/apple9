import { Skeleton } from "@/components/ui/Skeleton";

export default function AiCounselingLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat window */}
        <div className="bg-white rounded-xl border border-black/10 flex flex-col" style={{ height: 520 }}>
          {/* Messages area */}
          <div className="flex-1 p-6 space-y-4 overflow-hidden">
            {/* AI message */}
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-16 w-72 rounded-xl" />
            </div>
            {/* User message */}
            <div className="flex gap-3 justify-end">
              <Skeleton className="h-10 w-56 rounded-xl" />
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            </div>
            {/* AI message */}
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-20 w-80 rounded-xl" />
            </div>
          </div>

          {/* Input bar */}
          <div className="border-t border-black/10 p-4 flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
