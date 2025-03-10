"use client";

import { useActionState } from "react";
import { authenticate } from "../action";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  return (
    <form action={formAction} className="space-y-6">
      {errorMessage && (
        <div className="rounded-md bg-red-500/10 p-4 backdrop-blur-sm">
          <p className="text-sm text-red-400">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-400 shadow-sm backdrop-blur-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
          />
        </div>
      </div>

      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        disabled={isPending}
        type="submit"
        className="flex w-full transform justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}
