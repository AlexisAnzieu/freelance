import Image from "next/image";
import Link from "next/link";

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
    <div className="overflow-x-auto rounded-md border border-[#e8e8e8]">
      <table className="min-w-full divide-y divide-[#e8e8e8]">
        <thead className="bg-[#f7f7f5]">
          <tr>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider">
              {type === "customer" ? "Customer" : "Contractor"}
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e8e8] bg-white">
          {companies.map((company) => {
            const initial = (
              company.companyName?.trim()?.[0] ?? "?"
            ).toUpperCase();

            return (
              <tr
                key={company.id}
                className="hover:bg-[#f7f7f5] transition-colors duration-75 cursor-pointer group"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/${type}s/${company.id}/edit`}
                    className="flex items-center gap-3"
                  >
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={`${company.companyName} logo`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e8f4fd] text-xs font-medium text-[#2eaadc]">
                        {initial}
                      </div>
                    )}
                    <div className="text-sm font-medium text-[#37352f]">
                      {company.companyName}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/${type}s/${company.id}/edit`}
                    className="block"
                  >
                    <div className="text-sm text-[#37352f]">
                      {company.contactName}
                    </div>
                    {company.phone && (
                      <div className="text-xs text-[#9b9a97]">
                        {company.phone}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/${type}s/${company.id}/edit`}
                    className="block text-sm text-[#37352f]"
                  >
                    {company.email}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/${type}s/${company.id}/edit`}
                    className="block"
                  >
                    <div className="text-sm text-[#37352f]">
                      {company.city}, {company.country}
                    </div>
                    {company.state && (
                      <div className="text-xs text-[#9b9a97]">
                        {company.state}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <form
                    action={deleteAction}
                    className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                  >
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
