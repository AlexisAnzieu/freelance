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
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[#37352f] mb-1"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="block w-full rounded-md border border-[#e8e8e8] bg-white px-3 py-2 text-[#37352f] placeholder-[#9b9a97] text-sm transition-colors duration-100 focus:border-[#2eaadc] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] hover:border-[#d0d0d0]"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[#37352f] mb-1"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="block w-full rounded-md border border-[#e8e8e8] bg-white px-3 py-2 text-[#37352f] placeholder-[#9b9a97] text-sm transition-colors duration-100 focus:border-[#2eaadc] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] hover:border-[#d0d0d0]"
          />
        </div>
      </div>

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
        />
      </div>

      <button
        disabled={isPending}
        type="submit"
        className="flex w-full justify-center rounded-md bg-[#2eaadc] px-3 py-2 text-sm font-medium text-white transition-colors duration-100 hover:bg-[#2799c7] focus:outline-none focus:ring-1 focus:ring-[#2eaadc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sign up
      </button>

      <p className="text-center text-sm text-[#787774]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#2eaadc] transition-colors duration-100 hover:text-[#2799c7]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
