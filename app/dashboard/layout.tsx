"use client";

import { useState } from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-[#ffffff]">
      {/* Floating Hamburger Button - Mobile Only */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-3 left-3 z-50 md:hidden bg-[#ffffff] p-2.5 rounded-md border border-[#e8e8e8] hover:bg-[#f7f7f5] transition-colors duration-100"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5 text-[#37352f]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-[2px]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-60 flex-none
          transform transition-transform duration-200 ease-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <SideNav onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-grow pt-14 md:pt-0 md:overflow-y-auto bg-[#ffffff]">
        <div className="w-full px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
