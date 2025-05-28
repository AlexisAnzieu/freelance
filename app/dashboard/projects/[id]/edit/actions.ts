"use server";

import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

const UpdateProject = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  currency: z.string().default("USD"),
  companies: z.array(z.string()),
});

interface ProjectFormState {
  errors?: {
    name?: string[];
    description?: string[];
    currency?: string[];
    companies?: string[];
    _form?: string[];
  };
}

export async function updateProject(
  prevState: ProjectFormState,
  formData: FormData
) {
  try {
    const session = await auth();

    if (!session?.teamId) {
      return {
        errors: {
          _form: ["Unauthorized: No team access"],
        },
      };
    }

    const validatedFields = UpdateProject.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      currency: formData.get("currency"),
      companies: formData.getAll("companies"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description, currency, companies } = validatedFields.data;

    const projectId = formData.get("id")?.toString();
    if (!projectId) {
      return {
        errors: {
          _form: ["Project ID is required"],
        },
      };
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name,
        description,
        currency,
        companies: {
          set: companies.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard/projects");

    return { redirect: "/dashboard/projects", errors: {} };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      errors: {
        _form: ["Something went wrong"],
      },
    };
  }
}
