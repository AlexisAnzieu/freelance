import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeletons";
import Link from "next/link";
import TimeEntriesTable from "./time-entries-table";
import { calculateCostBreakdown } from "@/app/lib/utils";

const ITEMS_PER_PAGE = 20;

async function getProjectWithPaginatedTimeEntries(id: string, page: number) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

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
        orderBy: {
          date: "desc",
        },
        skip,
        take: ITEMS_PER_PAGE,
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Get total count and summary data separately
  const [totalCount, allEntriesForStats] = await Promise.all([
    prisma.timeTrackingItem.count({
      where: { projectId: id },
    }),
    prisma.timeTrackingItem.findMany({
      where: { projectId: id },
      include: {
        invoiceItem: {
          include: {
            invoice: true,
          },
        },
      },
    }),
  ]);

  // Calculate summary statistics from all entries
  const costBreakdown = calculateCostBreakdown(allEntriesForStats);
  const totalHours = allEntriesForStats.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );
  const totalShadowHours = allEntriesForStats.reduce(
    (sum, entry) => sum + (entry.shadowHours || 0),
    0
  );
  const hasShadowHours = allEntriesForStats.some((e) => e.shadowHours);

  return {
    project,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    summary: {
      totalHours,
      totalShadowHours,
      hasShadowHours,
      costBreakdown,
    },
  };
}

export default async function TimeTrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const { project, totalCount, totalPages, summary } =
    await getProjectWithPaginatedTimeEntries(id, currentPage);

  if (project.teamId !== session.teamId) {
    throw new Error("Unauthorized: Invalid team access");
  }

  const timeEntries = project.timeEntries;

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="flex items-center justify-center w-8 h-8 rounded-md text-[#9b9a97] hover:text-[#37352f] hover:bg-[#ebebea] transition-colors"
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
          <h1 className="text-xl font-semibold text-[#37352f] flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {project.name}
          </h1>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <TimeEntriesTable
          timeEntries={timeEntries}
          projectCurrency={project.currency}
          projectId={project.id}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          summary={summary}
        />
      </Suspense>
    </div>
  );
}
