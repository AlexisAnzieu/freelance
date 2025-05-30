import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeletons";
import Link from "next/link";
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
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/10">
            {project.currency}
          </span>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <TimeEntriesTable timeEntries={timeEntries} projectCurrency={project.currency} />
      </Suspense>
    </div>
  );
}
