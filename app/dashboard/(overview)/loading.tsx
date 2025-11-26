export default function Loading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-7 w-40 rounded bg-[#e8e8e8] animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-[#e8e8e8] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-md border border-[#e8e8e8] bg-white p-4"
          >
            <div className="h-4 w-24 rounded bg-[#e8e8e8] animate-pulse" />
            <div className="mt-2 h-8 w-20 rounded bg-[#e8e8e8] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
