"use server";

import { auth } from "@/auth";
import { deleteInvoice } from "@/app/lib/services/delete";

export async function deleteInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoiceId = formData.get("invoiceId") as string;
  if (!invoiceId) throw new Error("Invoice ID is required");

  await deleteInvoice(invoiceId);
}
