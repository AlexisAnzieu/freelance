import prisma from "../../lib/prisma";
import { auth } from "@/auth";
import { CompanyTable } from "@/app/ui/companies/company-table";
import { deleteCustomerAction } from "./actions";

async function getCustomers() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const customers = await prisma.company.findMany({
    where: {
      teamId: session.teamId,
      types: {
        some: {
          name: "customer",
        },
      },
    },
    orderBy: {
      companyName: "asc",
    },
  });
  return customers;
}

export default async function Page() {
  const customers = await getCustomers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <a
          href="/dashboard/customers/create"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Create Customer
        </a>
      </div>
      <CompanyTable
        companies={customers}
        type="customer"
        deleteAction={deleteCustomerAction}
      />
    </div>
  );
}
