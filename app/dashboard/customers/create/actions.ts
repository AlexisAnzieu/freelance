"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCustomer(formData: FormData) {
  try {
    await prisma.customer.create({
      data: {
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
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}
