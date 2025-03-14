import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import Link from "next/link";
import MonthlySummary from "./monthly-summary";
import TimeEntriesTable from "./time-entries-table";

async function getProjectWithTimeEntries(projectId: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      teamId: session.teamId,
    },
    include: {
      timeTracking: {
        include: {
          items: {
            orderBy: {
              date: "desc",
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
  const { id } = await params;
  const project = await getProjectWithTimeEntries(id);
  const allTimeEntries = project.timeTracking.flatMap((t) => t.items);
  const totalHours = allTimeEntries.reduce((sum, item) => sum + item.hours, 0);
  const totalAmount = allTimeEntries.reduce(
    (sum, item) => sum + item.hours * item.hourlyRate,
    0
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Time tracking details</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href={`/dashboard/time-tracking/create?projectId=${project.id}`}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg
                className="-ml-0.5 mr-1.5 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Time Entry
            </Link>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Hours
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {totalHours.toFixed(1)}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Amount
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${totalAmount.toFixed(2)}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Avg. Rate
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              $
              {allTimeEntries.length > 0
                ? (
                    allTimeEntries.reduce(
                      (sum, item) => sum + item.hourlyRate,
                      0
                    ) / allTimeEntries.length
                  ).toFixed(2)
                : "0.00"}
            </dd>
          </div>
          <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Entries
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {allTimeEntries.length}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-8">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <MonthlySummary timeTrackingList={project.timeTracking} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96" />}>
          <TimeEntriesTable timeTrackingList={project.timeTracking} />
        </Suspense>
      </div>
    </div>
  );
}
