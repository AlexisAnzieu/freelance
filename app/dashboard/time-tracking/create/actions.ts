"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface TimeEntryFormData {
  date: Date;
  description: string;
  hours: number;
  hourlyRate: number;
  projectId: string;
}

export async function createTimeEntry({
  date,
  description,
  hours,
  hourlyRate,
  projectId,
}: TimeEntryFormData) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // Create the time entry
  const timeEntry = await prisma.timeTrackingItem.create({
    data: {
      date,
      description,
      hours,
      hourlyRate,
      status: "pending", // Default status
      projectId,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/dashboard/time-tracking/${projectId}`);

  return timeEntry;
}
