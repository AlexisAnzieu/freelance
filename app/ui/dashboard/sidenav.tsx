"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { handleSignOut } from "./actions";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    name: "Contractors",
    href: "/dashboard/contractors",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>
    ),
  },
];

export default function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#fbfbfa] dark:bg-[#191919] px-2 py-3 pt-16 md:pt-3 border-r border-[#e8e8e8] dark:border-[#2f2f2f]">
      {/* Workspace Header - Notion style */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
          className="flex w-full items-center gap-2 px-2 py-1.5 mb-1 rounded-md hover:bg-[#ebebea] dark:hover:bg-[#2b2b2b] cursor-pointer transition-colors duration-75 group"
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-semibold shadow-sm">
            F
          </div>
          <span className="text-[14px] font-medium text-[#37352f] dark:text-[#ffffffcf] truncate flex-1 text-left">
            Freezerlance
          </span>
          <svg
            className={clsx(
              "w-4 h-4 text-[#9b9a97] dark:text-[#5a5a5a] transition-all duration-150",
              isWorkspaceMenuOpen
                ? "opacity-100 rotate-180"
                : "opacity-0 group-hover:opacity-100"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isWorkspaceMenuOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#252525] rounded-lg shadow-lg border border-[#e8e8e8] dark:border-[#3a3a3a] py-1 z-50 animate-fade-in">
            <form action={handleSignOut}>
              <button className="flex w-full items-center gap-2 px-3 py-1.5 text-[14px] text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-75 cursor-pointer group">
                <svg
                  className="w-[18px] h-[18px] text-red-500 dark:text-red-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                <span>Sign out</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e8e8e8] dark:bg-[#2f2f2f] mx-2 my-2" />

      {/* Navigation */}
      <div className="flex flex-col flex-1 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={clsx(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-[14px] transition-colors duration-75 group",
                {
                  "bg-[#ebebea] dark:bg-[#2b2b2b] text-[#37352f] dark:text-[#ffffffcf]":
                    isActive,
                  "text-[#5f5e5b] dark:text-[#9b9a97] hover:bg-[#ebebea] dark:hover:bg-[#2b2b2b] hover:text-[#37352f] dark:hover:text-[#ffffffcf]":
                    !isActive,
                }
              )}
            >
              <span
                className={clsx("flex-shrink-0 transition-colors", {
                  "text-[#37352f] dark:text-[#ffffffcf]": isActive,
                  "text-[#9b9a97] dark:text-[#5a5a5a] group-hover:text-[#5f5e5b] dark:group-hover:text-[#9b9a97]":
                    !isActive,
                })}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
