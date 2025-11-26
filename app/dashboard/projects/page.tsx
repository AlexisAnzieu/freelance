import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import ProjectTable from "@/app/ui/projects/project-table";
import { deleteProjectAction } from "./actions";

async function getProjects() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const projects = await prisma.project.findMany({
    where: {
      teamId: session.teamId,
    },
    include: {
      companies: {
        select: {
          companyName: true,
        },
      },
      timeEntries: {
        select: {
          id: true,
          hours: true,
          hourlyRate: true,
          invoiceItemId: true,
          invoiceItem: {
            select: {
              invoice: {
                select: {
                  status: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects.map((project) => ({
    ...project,
    _count: {
      timeEntries: project.timeEntries.length,
      invoicedTimeEntries: project.timeEntries.filter(
        (entry) => entry.invoiceItemId !== null
      ).length,
    },
  }));
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-[#37352f]">Projects</h1>
          <p className="mt-1 text-sm text-[#787774]">
            Manage your projects and track time for each one
          </p>
        </div>
        <a
          href="/dashboard/projects/create"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2eaadc] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2799c7]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New
        </a>
      </div>

      <ProjectTable projects={projects} onDelete={deleteProjectAction} />
    </div>
  );
}
