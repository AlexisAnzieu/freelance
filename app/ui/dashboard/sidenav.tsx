"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { handleSignOut } from "./actions";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    name: "Contractors",
    href: "/dashboard/contractors",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-gray-900 to-gray-800 px-3 py-4 md:px-6">
      <Link
        className="mb-8 flex items-end justify-start rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:h-20 transition-transform hover:scale-[1.02] hover:shadow-lg"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <span className="text-2xl font-bold tracking-tight">
            Freezerlance
          </span>
        </div>
      </Link>
      <div className="flex grow flex-row  space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-150 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-blue-600/10 text-blue-500 shadow-sm": isActive,
                  "text-gray-400 hover:bg-gray-800 hover:text-blue-400":
                    !isActive,
                }
              )}
            >
              {item.icon}
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <form action={handleSignOut}>
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </div>
  );
}
