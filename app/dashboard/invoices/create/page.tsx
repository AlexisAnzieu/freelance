import prisma from "@/app/lib/prisma";
import { Form, PrefillData } from "./create-form";
import { auth } from "@/auth";
import { filterCompaniesByType } from "@/app/lib/db";
import { COMPANY_TYPES } from "@/app/lib/constants";

interface SearchParams {
  projectId?: string;
  timeEntryIds?: string;
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

  const { projectId, timeEntryIds } = await searchParams;

  // Fetch project data and time entries if IDs are provided
  let prefillData: PrefillData = {};

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        teamId: session.teamId,
      },
      include: {
        companies: {
          include: {
            types: true,
          },
        },
      },
    });

    if (project) {
      const customer = project.companies.find((company) =>
        company.types.some((type) => type.name === "customer")
      );
      const contractor = project.companies.find((company) =>
        company.types.some((type) => type.name === "contractor")
      );

      prefillData = {
        name: project.name,
        customerId: customer?.id,
        contractorId: contractor?.id,
        currency: project.currency,
      };
    }
  }

  if (timeEntryIds) {
    const ids = timeEntryIds.split(",");
    const timeEntries = await prisma.timeTrackingItem.findMany({
      where: {
        id: { in: ids },
        project: { teamId: session.teamId },
      },
    });
    prefillData.items = timeEntries.map((entry) => ({
      name: entry.description,
      quantity: entry.hours,
      unitaryPrice: entry.hourlyRate,
      timeEntryId: entry.id,
    }));
  }

  return (
    <main>
      <h1 className="mb-6 text-xl font-semibold text-[#37352f]">
        Create Invoice
      </h1>
      <Form
        customers={customers}
        contractors={contractors}
        prefillData={prefillData}
      />
    </main>
  );
}
