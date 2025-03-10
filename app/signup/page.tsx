import Link from "next/link";
import SignupForm from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <div className="mt-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
