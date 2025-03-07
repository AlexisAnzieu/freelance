import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./app/lib/prisma";
declare module "next-auth" {
  interface User {
    teamId: string;
    firstName: string;
    lastName: string;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        teamId: string;
      } | null> {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        const encoder = new TextEncoder();
        const passwordHash = await crypto.subtle.digest(
          "SHA-256",
          encoder.encode(credentials.password as string)
        );
        const hashedPassword = Buffer.from(passwordHash).toString("hex");

        const passwordMatch = hashedPassword === user.passwordHash;

        if (!passwordMatch) {
          return null;
        }

        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          teamId: user.teamId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return user ? { ...token, ...user } : token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          teamId: token.teamId as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
        },
      };
    },
  },
});
