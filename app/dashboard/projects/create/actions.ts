"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";

const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  companies: z.array(z.string()).optional(),
});

interface ProjectFormState {
  errors?: {
    name?: string[];
    description?: string[];
    companies?: string[];
    _form?: string[];
  };
}

export async function createProject(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const session = await auth();

  if (!session?.teamId) {
    return {
      errors: {
        _form: ["Unauthorized: No team access"],
      },
    };
  }

  const validatedFields = ProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    companies: formData.getAll("companies"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, companies } = validatedFields.data;

  try {
    await prisma.project.create({
      data: {
        name,
        description,
        team: {
          connect: {
            id: session.teamId,
          },
        },
        ...(companies && companies.length > 0
          ? {
              companies: {
                connect: companies.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
  } catch (error: unknown) {
    console.error("Failed to create project:", error);
    return {
      errors: {
        _form: ["Failed to create project"],
      },
    };
  }

  redirect("/dashboard/projects");
}
