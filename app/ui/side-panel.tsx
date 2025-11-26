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
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div
          ref={panelRef}
          className={`w-screen max-w-xl transform bg-white border-l border-[#e8e8e8] transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-[#e8e8e8] px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#37352f]">
                  {title}
                </h2>
                <button
                  type="button"
                  className="rounded p-1.5 text-[#9b9a97] hover:bg-[#f1f1f0] hover:text-[#37352f] transition-colors duration-100"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
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
            <div className="relative flex-1 overflow-y-auto p-5">
              <div className="h-full">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
