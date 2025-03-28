import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeletons";
import TimeEntriesTable from "./time-entries-table";

async function getProjectWithTimeEntries(id: string) {
  const project = await prisma.project.findFirst({
    where: { id },
    include: {
      timeEntries: {
        include: {
          invoiceItem: {
            include: {
              invoice: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export default async function TimeTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const { id } = await params;
  const project = await getProjectWithTimeEntries(id);

  if (project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  const timeEntries = project.timeEntries;

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <TimeEntriesTable timeEntries={timeEntries} />
      </Suspense>
    </div>
  );
}
