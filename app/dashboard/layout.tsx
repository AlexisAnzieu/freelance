"use client";

import { useState } from "react";
import SideNav from "../ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Floating Hamburger Button - Mobile Only */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 p-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 ring-2 ring-blue-500/30"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 flex-none
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <SideNav onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 pt-20 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
