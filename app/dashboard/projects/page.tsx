import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import ProjectGrid from "@/app/ui/projects/project-grid";
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
      _count: {
        select: {
          timeTracking: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your projects and track time for each one
        </p>
      </div>

      <ProjectGrid projects={projects} onDelete={deleteProjectAction} />
    </div>
  );
}
