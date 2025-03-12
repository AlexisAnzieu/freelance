import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(invoiceId: string) {
  try {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
}

export async function deleteCompany(
  companyId: string,
  type: "customer" | "contractor"
) {
  try {
    await prisma.company.delete({
      where: {
        id: companyId,
      },
    });
    revalidatePath(`/dashboard/${type}s`);
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    throw new Error(`Failed to delete ${type}: ${error.message}`);
  }
}
