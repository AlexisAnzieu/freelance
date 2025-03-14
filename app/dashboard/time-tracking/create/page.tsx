import { Suspense } from "react";
import { Skeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import TimeEntryForm from "./time-entry-form";

async function getProject(projectId: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export default async function CreateTimeEntryPage({
  searchParams,
}: {
  searchParams?: Promise<{
    projectId?: string;
  }>;
}) {
  const { projectId } = (await searchParams) || {};

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await getProject(projectId);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Time Entry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track time for project: {project.name}
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <TimeEntryForm project={project} />
      </Suspense>
    </div>
  );
}
