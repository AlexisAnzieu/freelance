import prisma from "@/app/lib/prisma";
import { Form } from "./create-form";
import { auth } from "@/auth";
import { filterCompaniesByType } from "@/app/lib/db";
import { COMPANY_TYPES } from "@/app/lib/constants";

interface SearchParams {
  customerId?: string;
  contractorId?: string;
  items?: string;
  name?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const companies = await prisma.company.findMany({
    where: {
      teamId: session.teamId,
    },
    orderBy: {
      companyName: "asc",
    },
    include: {
      types: true,
    },
  });

  const customers = filterCompaniesByType(companies, COMPANY_TYPES.CUSTOMER);
  const contractors = filterCompaniesByType(
    companies,
    COMPANY_TYPES.CONTRACTOR
  );

  const { items, customerId, contractorId, name } = await searchParams;

  // Parse pre-filled items if they exist
  const prefillItems = items ? JSON.parse(items) : null;

  return (
    <main>
      <h1 className="mb-8 text-xl md:text-2xl">Create Invoice</h1>
      <Form
        customers={customers}
        contractors={contractors}
        prefillData={{
          name,
          customerId,
          contractorId,
          items: prefillItems,
        }}
      />
    </main>
  );
}
