"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitaryPrice: number;
  timeEntryId?: string;
}

export async function createInvoice(formData: FormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // Parse items from form data
  const items: InvoiceItem[] = [];
  let i = 0;
  while (formData.has(`items[${i}].name`)) {
    items.push({
      name: formData.get(`items[${i}].name`) as string,
      quantity: Number(formData.get(`items[${i}].quantity`)),
      unitaryPrice: Number(formData.get(`items[${i}].unitaryPrice`)),
      timeEntryId: formData.get(`items[${i}].timeEntryId`) as string,
    });
    i++;
  }

  // Calculate total amount
  const amount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitaryPrice,
    0
  );
  const tax = parseFloat((formData.get("tax") as string) || "0");
  const totalAmount = amount * (1 + tax / 100);

  try {
    // Create the invoice and get the created invoice items
    const invoice = await prisma.invoice.create({
      include: {
        items: true,
      },
      data: {
        name: formData.get("name") as string,
        teamId: session.teamId,
        number: formData.get("number") as string,
        date: new Date(formData.get("date") as string),
        dueDate: new Date(formData.get("dueDate") as string),
        status: "draft",
        currency: (formData.get("currency") as string) || "USD",
        amount,
        tax,
        totalAmount,
        companies: {
          connect: [
            {
              id: formData.get("customerId") as string,
            },
            {
              id: formData.get("contractorId") as string,
            },
          ],
        },
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitaryPrice: item.unitaryPrice,
          })),
        },
      },
    });

    // Update time entries with their invoice item IDs
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.timeEntryId) {
        await prisma.timeTrackingItem.update({
          where: { id: item.timeEntryId },
          data: {
            invoiceItemId: invoice.items[i].id,
          },
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
