import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { CompanyForm } from "@/app/ui/companies/company-form";
import { editContractorAction } from "./actions";

async function getContractor(id: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const contractor = await prisma.company.findFirst({
    where: {
      id,
      teamId: session.teamId,
      types: {
        some: {
          name: "contractor",
        },
      },
    },
  });

  if (!contractor) {
    throw new Error("Contractor not found");
  }

  return contractor;
}

export default async function Page({ params }: { params: { id: string } }) {
  const contractor = await getContractor(params.id);

  async function editWithId(formData: FormData) {
    "use server";
    formData.append("contractorId", params.id);
    await editContractorAction(formData);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Contractor</h1>
      </div>
      <CompanyForm
        title="Contractor"
        onSubmit={editWithId}
        mode="edit"
        defaultValues={{
          companyName: contractor.companyName,
          contactName: contractor.contactName || "",
          email: contractor.email,
          phone: contractor.phone || "",
          address: contractor.address,
          city: contractor.city,
          state: contractor.state || "",
          postalCode: contractor.postalCode,
          country: contractor.country,
          taxId: contractor.taxId || "",
          notes: contractor.notes || "",
        }}
      />
    </div>
  );
}
