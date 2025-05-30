import { Skeleton } from "@/app/ui/skeletons";

export default function LoadingTimeTracking() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100">
            <div className="h-5 w-5 mx-auto mt-1.5 bg-gray-200 rounded animate-pulse" />
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
