export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="mt-1 h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-gray-900/5 space-y-6">
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>

        <div>
          <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
        </div>

        <div>
          <div className="h-5 w-36 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="mt-1 h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex justify-end gap-x-6">
          <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
