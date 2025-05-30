export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="mt-1 h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="relative overflow-x-auto rounded-2xl bg-white/50 backdrop-blur-xl shadow-lg border border-white/10">
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <tr>
                <th className="px-6 py-4 w-40">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-4 w-64">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="px-6 py-4">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-6 py-4">
                    <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-block h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex gap-2">
                      <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                      <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-1.5 w-32 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  </td>
                  <td className="relative w-32">
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                      <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                      <div className="h-7 w-7 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
