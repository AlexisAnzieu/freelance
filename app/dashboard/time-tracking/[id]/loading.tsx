import { Skeleton } from "@/app/ui/skeletons";

export default function LoadingTimeTracking() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
          <div className="mt-4 sm:mt-0">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </dl>
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
