import { Skeleton } from "@/app/ui/skeletons";

export default function InvoiceDetailsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Invoice Details
          </h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-4">
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
