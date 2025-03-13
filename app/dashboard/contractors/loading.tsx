import { Skeleton } from "@/app/ui/skeletons";

export default function ContractorsLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Contractors</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all contractors in your team.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="min-w-full divide-y divide-gray-300">
                <div className="bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-24" />
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-200 bg-white">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 gap-4 px-4 py-4 sm:px-6 lg:px-8"
                    >
                      {[...Array(4)].map((_, j) => (
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
    </div>
  );
}
