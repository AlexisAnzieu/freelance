"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function createInvoice(formData: FormData) {
  const session = await auth();

  if (!session?.user?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const rawAmount = formData.get("amount") as string;
  const rawTax = formData.get("tax") as string;
  const amount = parseFloat(rawAmount);
  const tax = parseFloat(rawTax || "0");
  const totalAmount = amount * (1 + tax / 100);

  try {
    await prisma.invoice.create({
      data: {
        teamId: session.user.teamId,
        number: formData.get("number") as string,
        date: new Date(formData.get("date") as string),
        dueDate: new Date(formData.get("dueDate") as string),
        status: "draft",
        amount,
        tax,
        totalAmount,
        customerId: formData.get("customerId") as string,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
