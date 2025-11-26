import prisma from "../../lib/prisma";
import { auth } from "@/auth";
import { CompanyTable } from "@/app/ui/companies/company-table";
import { deleteContractorAction } from "./actions";

async function getContractors() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const contractors = await prisma.company.findMany({
    where: {
      teamId: session.teamId,
      types: {
        some: {
          name: "contractor",
        },
      },
    },
    orderBy: {
      companyName: "asc",
    },
  });
  return contractors;
}

export default async function Page() {
  const contractors = await getContractors();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#37352f]">Contractors</h1>
          <p className="mt-1 text-sm text-[#787774]">
            Manage your contractor relationships
          </p>
        </div>
        <a
          href="/dashboard/contractors/create"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2eaadc] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2799c7]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New
        </a>
      </div>
      <CompanyTable
        companies={contractors}
        type="contractor"
        deleteAction={deleteContractorAction}
      />
    </div>
  );
}
