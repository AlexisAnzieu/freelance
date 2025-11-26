import { Suspense } from "react";
import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import ProjectForm from "@/app/ui/projects/project-form";
import { createProject } from "./actions";

async function getCompanies() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const companies = await prisma.company.findMany({
    where: {
      teamId: session.teamId,
    },
    include: {
      types: true,
    },
    orderBy: {
      companyName: "asc",
    },
  });

  return companies;
}

export default async function CreatePage() {
  const companies = await getCompanies();

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#37352f]">
          Create New Project
        </h1>
        <p className="mt-1 text-sm text-[#9b9a97]">
          Create a new project to start tracking time and managing tasks
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-20 w-full animate-pulse rounded-md bg-[#f1f1f0]" />
        }
      >
        <ProjectForm companies={companies} action={createProject} />
      </Suspense>
    </div>
  );
}
