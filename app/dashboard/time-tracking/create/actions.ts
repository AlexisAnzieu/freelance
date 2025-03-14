"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateTimeEntryParams {
  projectId: string;
  date: Date;
  description: string;
  hours: number;
  hourlyRate: number;
}

export async function createTimeEntry({
  projectId,
  date,
  description,
  hours,
  hourlyRate,
}: CreateTimeEntryParams) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // First, find or create a TimeTracking record for this month
  const month = new Date(date.getFullYear(), date.getMonth(), 1);
  let timeTracking = await prisma.timeTracking.findFirst({
    where: {
      projectId,
      month,
    },
  });

  if (!timeTracking) {
    timeTracking = await prisma.timeTracking.create({
      data: {
        projectId,
        month,
        status: "pending",
      },
    });
  }

  // Create the time entry
  const timeEntry = await prisma.timeTrackingItem.create({
    data: {
      date,
      description,
      hours,
      hourlyRate,
      timeTrackingId: timeTracking.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);

  return timeEntry;
}
