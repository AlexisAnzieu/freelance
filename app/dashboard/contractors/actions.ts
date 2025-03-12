"use server";

import { auth } from "@/auth";
import { deleteCompany } from "@/app/lib/services/delete";

export async function deleteContractorAction(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const contractorId = formData.get("contractorId") as string;
  if (!contractorId) throw new Error("Contractor ID is required");

  await deleteCompany(contractorId, "contractor");
}
