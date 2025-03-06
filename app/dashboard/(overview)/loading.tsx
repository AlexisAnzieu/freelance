export default function Loading() {
  return (
    <div className="p-6">
      <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
        <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
              <div className="mt-1 h-9 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
