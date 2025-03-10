"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "../action";

export default function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signup, undefined);

  if (state === "success") {
    router.push("/dashboard");
    return null;
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-white"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 shadow-sm backdrop-blur-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-white"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 shadow-sm backdrop-blur-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 shadow-sm backdrop-blur-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 shadow-sm backdrop-blur-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
        />
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="flex w-full transform justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign up
      </button>

      <p className="mt-2 text-center text-sm text-gray-300">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
