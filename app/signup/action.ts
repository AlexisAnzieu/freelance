"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import prisma from "@/app/lib/prisma";

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

    // Hash password using SHA-256
    const encoder = new TextEncoder();
    const passwordHash = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(password)
    );
    const hashedPassword = Buffer.from(passwordHash).toString("hex");

    // Create everything in a single transaction
    const teamName = `${firstName} ${lastName} team`;

    await prisma.$transaction(async (prisma) => {
      // Create team
      const team = await prisma.team.create({
        data: {
          name: teamName,
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
        },
      });

      // Create team membership
      await prisma.userTeam.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: "ADMIN",
        },
      });
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
