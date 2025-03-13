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
  {
    name: "Time Tracking",
    href: "/dashboard/time-tracking",
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-gray-950 to-gray-900 px-3 py-4 md:px-6">
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
      <div className="w-32 text-blue-300 md:w-40 relative group-hover:text-blue-200 px-3 mb-4">
        <span className="text-2xl font-bold tracking-tight drop-shadow-sm">
          Freezerlance
        </span>
      </div>
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-3 pb-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex h-[48px] grow items-center justify-center gap-3 rounded-lg p-3 text-sm font-medium transition-all duration-300 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3 relative overflow-hidden group hover:scale-[1.02]",
                {
                  "bg-blue-600/20 text-blue-300 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30 hover:bg-blue-600/30 hover:text-blue-200":
                    isActive,
                  "text-gray-400 hover:bg-gray-800/80 hover:text-blue-200 hover:shadow-md hover:ring-1 hover:ring-blue-400/30":
                    !isActive,
                }
              )}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <div
                className={clsx("transition-transform duration-300", {
                  "scale-110": isActive,
                  "group-hover:scale-110": !isActive,
                })}
              >
                {item.icon}
              </div>
              <span className="hidden md:block">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <form action={handleSignOut}>
        <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-800/40 p-3 text-sm font-medium text-gray-300 transition-all hover:bg-red-500/20 hover:text-red-300 hover:shadow-md hover:shadow-red-500/10 hover:scale-[1.02] cursor-pointer md:justify-start md:p-2 md:px-3 mt-6 group relative overflow-hidden hover:ring-1 hover:ring-red-400/30">
          <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform group-hover:scale-110 duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </div>
  );
}
