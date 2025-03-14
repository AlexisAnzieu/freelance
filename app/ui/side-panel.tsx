"use client";

import { useEffect, useRef } from "react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SidePanel({
  isOpen,
  onClose,
  title,
  children,
}: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div
          ref={panelRef}
          className={`w-screen max-w-2xl transform bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold leading-6 text-white">
                  {title}
                </h2>
                <button
                  type="button"
                  className="rounded-md bg-blue-600/50 p-2 text-white hover:bg-blue-500/50 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative flex-1 overflow-y-auto p-6">
              <div className="h-full">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
