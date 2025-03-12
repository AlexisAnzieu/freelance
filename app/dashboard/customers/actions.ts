"use server";

import { auth } from "@/auth";
import { deleteCompany } from "@/app/lib/services/delete";

export async function deleteCustomerAction(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const customerId = formData.get("customerId") as string;
  if (!customerId) throw new Error("Customer ID is required");

  await deleteCompany(customerId, "customer");
}
