"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTimeEntry(id: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  // First get the time entry to get its related project
  const timeEntry = await prisma.timeTrackingItem.findFirst({
    where: { id },
    include: {
      timeTracking: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!timeEntry) {
    throw new Error("Time entry not found");
  }

  // Verify user has access to this project's team
  if (timeEntry.timeTracking.project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  // Delete the time entry
  await prisma.timeTrackingItem.delete({
    where: { id },
  });

  // Check if this was the last entry in the time tracking group
  const remainingEntries = await prisma.timeTrackingItem.count({
    where: {
      timeTrackingId: timeEntry.timeTrackingId,
    },
  });

  // If no more entries, delete the time tracking group
  if (remainingEntries === 0) {
    await prisma.timeTracking.delete({
      where: { id: timeEntry.timeTrackingId },
    });
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${timeEntry.timeTracking.projectId}`);
  revalidatePath(
    `/dashboard/time-tracking/${timeEntry.timeTracking.projectId}`
  );

  return { success: true };
}
