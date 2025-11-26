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
    <form action={formAction} className="space-y-4">
      {errorMessage && (
        <div className="rounded-md bg-[#fde8e8] border border-[#fbd5d5] p-3">
          <p className="text-sm text-[#eb5757]">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#37352f] mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full rounded-md border border-[#e8e8e8] bg-white px-3 py-2 text-[#37352f] placeholder-[#9b9a97] text-sm transition-colors duration-100 focus:border-[#2eaadc] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] hover:border-[#d0d0d0]"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#37352f] mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full rounded-md border border-[#e8e8e8] bg-white px-3 py-2 text-[#37352f] placeholder-[#9b9a97] text-sm transition-colors duration-100 focus:border-[#2eaadc] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] hover:border-[#d0d0d0]"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <button
        disabled={isPending}
        type="submit"
        className="flex w-full justify-center rounded-md bg-[#2eaadc] px-3 py-2 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#2799c7] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}
