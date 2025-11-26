import { cn } from "@/app/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-[#f1f1f0]", className)}
      {...props}
    />
  );
}

export function InvoiceTableSkeleton() {
  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md border border-[#e8e8e8]">
            <div className="min-w-full divide-y divide-[#e8e8e8]">
              <div className="bg-[#f7f7f5]">
                <div className="grid grid-cols-7 gap-4 px-4 py-2.5">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-20" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-[#e8e8e8] bg-white">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 px-4 py-3">
                    {[...Array(7)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-20" />
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
    <div className="rounded-md border border-[#e8e8e8] bg-white p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-[#e8e8e8] bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mt-2 h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoiceFormSkeleton() {
  return (
    <div className="rounded-md border border-[#e8e8e8] bg-white">
      <div className="px-4 py-5">
        <div className="grid max-w-2xl grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="sm:col-span-3">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
