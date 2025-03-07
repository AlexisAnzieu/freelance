"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

type SignupResult =
  | "success"
  | "All fields are required"
  | "User with this email already exists"
  | "Authentication failed"
  | "Something went wrong during signup";

export async function signup(
  prevState: SignupResult | undefined,
  formData: FormData
): Promise<SignupResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email || !password || !firstName || !lastName) {
      return "All fields are required";
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "User with this email already exists";
    }

    // Create team
    const teamName = `${firstName} ${lastName} team`;
    const teamSlug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const team = await prisma.team.create({
      data: {
        name: teamName,
        slug: teamSlug,
      },
    });

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        teamId: team.id,
      },
    });

    // Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // The auth callback will handle the redirect to dashboard
    return "success";
  } catch (error) {
    if (error instanceof AuthError) {
      return "Authentication failed";
    }
    console.error("Signup error:", error);
    return "Something went wrong during signup";
  }
}
