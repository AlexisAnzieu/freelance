"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTimeEntry(
  id: string,
  data: {
    date: Date;
    description: string;
    hours: number;
    hourlyRate: number;
  }
) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // Get the time entry to verify project access
  const timeEntry = await prisma.timeTrackingItem.findFirst({
    where: { id },
    include: {
      project: true,
    },
  });

  if (!timeEntry) {
    throw new Error("Time entry not found");
  }

  // Verify user has access to this project's team
  if (timeEntry.project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  // Update the time entry
  await prisma.timeTrackingItem.update({
    where: { id },
    data: {
      date: data.date,
      description: data.description,
      hours: data.hours,
      hourlyRate: data.hourlyRate,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${timeEntry.project.id}`);
  revalidatePath(`/dashboard/time-tracking/${timeEntry.project.id}`);

  return { success: true };
}

export async function deleteTimeEntry(id: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // Get the time entry to get its related project
  const timeEntry = await prisma.timeTrackingItem.findFirst({
    where: { id },
    include: {
      project: true,
    },
  });

  if (!timeEntry) {
    throw new Error("Time entry not found");
  }

  // Verify user has access to this project's team
  if (timeEntry.project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  // Delete the time entry
  await prisma.timeTrackingItem.delete({
    where: { id },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${timeEntry.project.id}`);
  revalidatePath(`/dashboard/time-tracking/${timeEntry.project.id}`);

  return { success: true };
}

export async function generateInvoice(timeEntryIds: string[]) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // Get time entries with project and company information
  const timeEntries = await prisma.timeTrackingItem.findMany({
    where: {
      id: { in: timeEntryIds },
    },
    include: {
      project: true,
    },
  });

  if (timeEntries.length === 0) {
    throw new Error("No time entries found");
  }

  // Get the first entry's project with companies
  const project = await prisma.project.findUnique({
    where: { id: timeEntries[0].projectId },
    include: {
      companies: {
        include: {
          types: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  // Find customer and contractor
  const customer = project.companies.find((company) =>
    company.types.some((type) => type.name === "customer")
  );
  const contractor = project.companies.find((company) =>
    company.types.some((type) => type.name === "contractor")
  );

  if (!customer || !contractor) {
    throw new Error("Project must have both customer and contractor");
  }

  // Create invoice items from time entries
  const invoiceItems = timeEntries.map((entry) => ({
    name: entry.description,
    quantity: entry.hours,
    unitaryPrice: entry.hourlyRate,
  }));

  // Create searchParams for invoice creation page
  const searchParams = new URLSearchParams();
  searchParams.set("customerId", customer.id);
  searchParams.set("contractorId", contractor.id);
  searchParams.set("name", project.name);
  searchParams.set(
    "items",
    JSON.stringify(
      invoiceItems.map((item, index) => ({
        ...item,
        timeEntryId: timeEntryIds[index],
      }))
    )
  );

  // Redirect to invoice creation page with pre-filled data
  redirect(`/dashboard/invoices/create?${searchParams.toString()}`);
}
