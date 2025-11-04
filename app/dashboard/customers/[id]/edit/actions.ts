"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editCustomerAction(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const customerId = formData.get("customerId") as string;

  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  await prisma.company.update({
    where: {
      id: customerId,
      teamId: session.teamId,
    },
    data: {
      companyName: rawFormData.companyName as string,
      contactName: (rawFormData.contactName as string) || null,
      email: rawFormData.email as string,
      phone: (rawFormData.phone as string) || null,
      address: rawFormData.address as string,
      city: rawFormData.city as string,
      state: (rawFormData.state as string) || null,
      postalCode: rawFormData.postalCode as string,
      country: rawFormData.country as string,
      taxId: (rawFormData.taxId as string) || null,
      notes: (rawFormData.notes as string) || null,
      paymentMethods: (rawFormData.paymentMethods as string) || null,
      logoUrl:
        rawFormData.logoUrl && typeof rawFormData.logoUrl === "string"
          ? rawFormData.logoUrl.trim().length > 0
            ? rawFormData.logoUrl.trim()
            : null
          : null,
    },
  });

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
