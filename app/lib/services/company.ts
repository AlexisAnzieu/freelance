import { COMPANY_TYPES, CompanyType } from "@/app/lib/constants";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CreateCompanyInput = {
  type: CompanyType;
  formData: FormData;
  teamId: string;
};

export async function createCompany({
  type,
  formData,
  teamId,
}: CreateCompanyInput) {
  if (!Object.values(COMPANY_TYPES).includes(type)) {
    throw new Error(`Invalid company type: ${type}`);
  }

  try {
    await prisma.company.create({
      data: {
        teamId,
        companyName: formData.get("companyName") as string,
        contactName: formData.get("contactName") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || null,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
        postalCode: formData.get("postalCode") as string,
        country: formData.get("country") as string,
        taxId: (formData.get("taxId") as string) || null,
        notes: (formData.get("notes") as string) || null,
        paymentMethods: (formData.get("paymentMethods") as string) || null,
        types: {
          connect: {
            name: type,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }
    throw error;
  }

  revalidatePath(`/dashboard/${type}s`);
  redirect(`/dashboard/${type}s`);
}
