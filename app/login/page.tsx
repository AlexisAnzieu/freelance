import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="text-center text-2xl font-semibold text-[#37352f]">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-[#787774]">
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-[#2eaadc] hover:text-[#2799c7] transition-colors duration-100"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse flex justify-center">
              <div className="h-32 w-full bg-[#f1f1f0] rounded"></div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
