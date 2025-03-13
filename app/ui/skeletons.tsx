import { cn } from "@/app/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
      {...props}
    />
  );
}

export function InvoiceTableSkeleton() {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
            <div className="min-w-full divide-y divide-gray-200 bg-white">
              <div className="bg-gray-50">
                <div className="grid grid-cols-7 gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-24" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-7 gap-4 px-4 py-4 sm:px-6 lg:px-8"
                  >
                    {[...Array(7)].map((_, j) => (
                      <Skeleton key={j} className="h-5 w-24" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RevenueCardsSkeleton() {
  return (
    <div className="rounded-xl bg-gradient-to-b from-white to-gray-50/50 p-6 shadow-sm ring-1 ring-gray-900/5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-7 w-32" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoiceFormSkeleton() {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sm:col-span-3">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
