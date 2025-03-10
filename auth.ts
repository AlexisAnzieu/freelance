import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./app/lib/prisma";
declare module "next-auth" {
  interface User {
    teams: string[];
    firstName: string;
    lastName: string;
  }

  interface Session {
    teamId: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }
}

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials): Promise<
        | ({
            email: string;
          } & User)
        | null
      > {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            teams: {
              select: {
                teamId: true,
              },
            },
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
          teams: user.teams.map((team) => team.teamId),
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
        teamId: (token.teams as string[])[0],
        user: {
          ...session.user,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
        },
      };
    },
  },
});
