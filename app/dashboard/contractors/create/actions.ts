"use server";

import { COMPANY_TYPES } from "@/app/lib/constants";
import { createCompany } from "@/app/lib/services/company";
import { auth } from "@/auth";

export async function createContractor(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  await createCompany({
    type: COMPANY_TYPES.CONTRACTOR,
    formData,
    teamId: session.teamId,
  });
}
