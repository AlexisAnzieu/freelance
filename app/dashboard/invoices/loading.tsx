import { InvoiceTableSkeleton } from "@/app/ui/skeletons";

export default function InvoicesLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices including their ID, customer, amount, and
            status.
          </p>
        </div>
        <div className="mt-4 sm:flex sm:items-center sm:space-x-4">
          <div className="h-10 w-72 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-4 sm:mt-0">
            <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
      <InvoiceTableSkeleton />
    </div>
  );
}
