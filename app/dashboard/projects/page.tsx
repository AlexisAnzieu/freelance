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
    <div className="p-6">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your projects and track time for each one
          </p>
        </div>
        <a
          href="/dashboard/projects/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
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
          Create Project
        </a>
      </div>

      <ProjectTable projects={projects} onDelete={deleteProjectAction} />
    </div>
  );
}
