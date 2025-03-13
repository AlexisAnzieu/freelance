import { Skeleton } from "@/app/ui/skeletons";

export default function CustomersLoading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="h-10 w-36 animate-pulse rounded-md bg-gray-200" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-32" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-40" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-5 w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-9 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
