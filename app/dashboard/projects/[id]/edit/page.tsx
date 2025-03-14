import { notFound } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import ProjectForm from "@/app/ui/projects/project-form";
import { updateProject } from "./actions";

async function getProject(id: string) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
    },
    include: {
      companies: {
        select: { id: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

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

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, companies] = await Promise.all([
    getProject(id),
    getCompanies(),
  ]);

  const defaultValues = {
    id: project.id,
    name: project.name,
    description: project.description || "",
    companies: project.companies.map((c) => c.id),
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update project details and associated companies
        </p>
      </div>

      <ProjectForm
        companies={companies}
        action={updateProject}
        defaultValues={defaultValues}
      />
    </div>
  );
}
