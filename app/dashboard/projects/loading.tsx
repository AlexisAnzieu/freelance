export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="h-7 w-32 bg-[#e8e8e8] rounded animate-pulse" />
          <div className="mt-2 h-4 w-64 bg-[#e8e8e8] rounded animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-[#e8e8e8] rounded animate-pulse" />
      </div>

      <div className="overflow-x-auto border border-[#e8e8e8] rounded-md bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e8e8] bg-[#fbfbfa]">
              <th className="px-4 py-2.5 w-40">
                <div className="h-4 w-16 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
              <th className="px-4 py-2.5">
                <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
              <th className="px-4 py-2.5 w-64">
                <div className="h-4 w-24 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
              <th className="px-4 py-2.5">
                <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
              <th className="px-4 py-2.5">
                <div className="h-4 w-24 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
              <th className="px-4 py-2.5">
                <div className="h-4 w-20 bg-[#e8e8e8] rounded animate-pulse" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[#e8e8e8] last:border-b-0">
                <td className="px-4 py-3">
                  <div className="h-4 w-28 bg-[#e8e8e8] rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="inline-block h-5 w-20 rounded bg-[#e8e8e8] animate-pulse" />
                </td>
                <td className="px-4 py-3 w-64">
                  <div className="flex gap-2">
                    <div className="h-5 w-24 rounded bg-[#e8e8e8] animate-pulse" />
                    <div className="h-5 w-24 rounded bg-[#e8e8e8] animate-pulse" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-[#e8e8e8] rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-[#e8e8e8] rounded animate-pulse" />
                      <div className="h-3 w-8 bg-[#e8e8e8] rounded animate-pulse" />
                    </div>
                    <div className="h-1 w-32 bg-[#e8e8e8] rounded-full animate-pulse" />
                  </div>
                </td>
                <td className="relative w-32">
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-7 w-7 rounded bg-[#e8e8e8] animate-pulse" />
                    <div className="h-7 w-7 rounded bg-[#e8e8e8] animate-pulse" />
                    <div className="h-7 w-7 rounded bg-[#e8e8e8] animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
