"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function deleteProjectAction(id: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  await prisma.project.findUnique({
    where: {
      id,
    },
  });
}
