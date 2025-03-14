"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitaryPrice: number;
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
    await prisma.invoice.create({
      data: {
        teamId: session.teamId,
        number: formData.get("number") as string,
        date: new Date(formData.get("date") as string),
        dueDate: new Date(formData.get("dueDate") as string),
        status: "draft",
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
