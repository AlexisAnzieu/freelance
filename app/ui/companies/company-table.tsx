import { type Company } from "@prisma/client";
import { DeleteButton } from "@/app/ui/delete-button";

interface CompanyTableProps {
  companies: Company[];
  type: "customer" | "contractor";
  deleteAction: (formData: FormData) => Promise<void>;
}

export function CompanyTable({
  companies,
  type,
  deleteAction,
}: CompanyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {type === "customer" ? "Customer" : "Contractor"}
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
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {company.companyName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {company.contactName}
                </div>
                {company.phone && (
                  <div className="text-sm text-gray-500">{company.phone}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{company.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {company.city}, {company.country}
                </div>
                {company.state && (
                  <div className="text-sm text-gray-500">{company.state}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <form action={deleteAction}>
                  <input type="hidden" name={`${type}Id`} value={company.id} />
                  <DeleteButton itemName={type} />
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
