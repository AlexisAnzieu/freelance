import Image from "next/image";

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
          {companies.map((company) => {
            const initial = (
              company.companyName?.trim()?.[0] ?? "?"
            ).toUpperCase();

            return (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={`${company.companyName} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {initial}
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {company.companyName}
                    </div>
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
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                  <a
                    href={`/dashboard/${type}s/${company.id}/edit`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-semibold"
                  >
                    Edit
                  </a>
                  <form action={deleteAction} className="inline-block">
                    <input
                      type="hidden"
                      name={`${type}Id`}
                      value={company.id}
                    />
                    <DeleteButton itemName={type} />
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
