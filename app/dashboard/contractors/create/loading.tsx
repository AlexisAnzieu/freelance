import { InvoiceFormSkeleton } from "@/app/ui/skeletons";

export default function CreateContractorLoading() {
  return (
    <div className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="pb-5">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">
          Add Contractor
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Fill in the information below to add a new contractor.
        </p>
      </div>
      <div className="mt-8">
        <InvoiceFormSkeleton />
      </div>
    </div>
  );
}
