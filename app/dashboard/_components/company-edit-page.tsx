import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { CompanyForm } from "@/app/ui/companies/company-form";

type CompanyType = "customer" | "contractor";

type CompanyEditPageProps = {
  id: string;
  type: CompanyType;
  title: string;
  idFieldName: string;
  editAction: (formData: FormData) => Promise<void>;
};

async function getCompany(id: string, type: CompanyType) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const company = await prisma.company.findFirst({
    where: {
      id,
      teamId: session.teamId,
      types: {
        some: {
          name: type,
        },
      },
    },
  });

  if (!company) {
    throw new Error(
      `${type === "customer" ? "Customer" : "Contractor"} not found`
    );
  }

  return company;
}

export async function CompanyEditPage({
  id,
  type,
  title,
  idFieldName,
  editAction,
}: CompanyEditPageProps) {
  const company = await getCompany(id, type);

  async function editWithId(formData: FormData) {
    "use server";
    formData.append(idFieldName, id);
    await editAction(formData);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit {title}</h1>
      </div>
      <CompanyForm
        title={title}
        onSubmit={editWithId}
        mode="edit"
        defaultValues={{
          companyName: company.companyName,
          contactName: company.contactName || "",
          email: company.email,
          phone: company.phone || "",
          address: company.address,
          city: company.city,
          state: company.state || "",
          postalCode: company.postalCode,
          country: company.country,
          taxId: company.taxId || "",
          notes: company.notes || "",
          paymentMethods: company.paymentMethods || "",
          logoUrl: company.logoUrl ?? undefined,
        }}
      />
    </div>
  );
}
