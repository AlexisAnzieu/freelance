export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="mt-1 h-4 w-64 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Project Card Skeleton */}
        <div className="bg-white/5 rounded-lg border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center">
          <div className="rounded-full bg-gray-200 p-3 mb-4 w-12 h-12 animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Project Card Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="h-4 w-full bg-gray-200 rounded mb-4 animate-pulse" />

              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
