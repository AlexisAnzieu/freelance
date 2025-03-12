"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createContractor(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  try {
    await prisma.company.create({
      data: {
        teamId: session.teamId,
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
        types: {
          connect: {
            name: "contractor",
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }

  revalidatePath("/dashboard/contractors");
  redirect("/dashboard/contractors");
}
