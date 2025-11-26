import Link from "next/link";
import SignupForm from "./components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div>
          <h2 className="text-center text-2xl font-semibold text-[#37352f]">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-[#787774]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2eaadc] hover:text-[#2799c7] transition-colors duration-100"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
