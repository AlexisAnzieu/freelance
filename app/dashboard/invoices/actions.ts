"use server";

import { auth } from "@/auth";
import { deleteInvoice } from "@/app/lib/services/delete";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export type InvoiceStatus = "draft" | "sent" | "paid";

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });

  revalidatePath("/dashboard/invoices");
  return invoice;
}

export async function deleteInvoiceAction(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoiceId = formData.get("invoiceId") as string;
  if (!invoiceId) throw new Error("Invoice ID is required");

  await deleteInvoice(invoiceId);
}
