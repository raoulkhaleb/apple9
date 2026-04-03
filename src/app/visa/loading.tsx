import { Skeleton } from "@/components/ui/Skeleton";

export default function VisaLoading() {
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-white border-b border-black/10 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-56 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
              {step < 4 && <Skeleton className="h-px w-8" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-black/10 p-8">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="space-y-5">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
