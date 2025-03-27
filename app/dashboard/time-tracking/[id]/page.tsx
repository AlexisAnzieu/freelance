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
  const totalHours = timeEntries.reduce((sum, item) => sum + item.hours, 0);
  const totalAmount = timeEntries.reduce(
    (sum, item) => sum + item.hours * item.hourlyRate,
    0
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <div className="text-right">
          <p className="text-lg">
            Total Hours:{" "}
            <span className="font-semibold">{totalHours.toFixed(1)}</span>
          </p>
          <p className="text-lg">
            Total Amount:{" "}
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <TimeEntriesTable timeEntries={timeEntries} />
      </Suspense>
    </div>
  );
}
