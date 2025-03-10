import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {"Don't have an account?"}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse flex justify-center">
              <div className="h-32 w-full bg-gray-700/50 rounded"></div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
