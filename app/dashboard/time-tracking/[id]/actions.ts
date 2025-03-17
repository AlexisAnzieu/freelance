"use server";

import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

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
