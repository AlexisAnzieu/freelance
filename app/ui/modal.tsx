"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  showCancel?: boolean;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  type?: "error" | "confirm" | "info";
}

export function Modal({
  isOpen,
  title,
  children,
  showCancel = false,
  showConfirm = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  type = "info",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
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

  if (!isOpen) return null;

  const headerClass = twMerge(
    "text-lg font-semibold mb-4",
    type === "error" && "text-red-600",
    type === "confirm" && "text-blue-600",
    type === "info" && "text-gray-900"
  );

  const confirmButtonClass = twMerge(
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105",
    type === "error" && "bg-red-600 hover:bg-red-700 text-white",
    type === "confirm" && "bg-blue-600 hover:bg-blue-700 text-white",
    type === "info" && "bg-gray-900 hover:bg-gray-800 text-white"
  );

  return createPortal(
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="animate-modal-appear w-full max-w-md bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mx-4 border border-white/20">
        {title && (
          <h2 id="modal-title" className={headerClass}>
            {title}
          </h2>
        )}
        <div className="text-gray-600">{children}</div>
        {(showCancel || showConfirm) && (
          <div className="flex justify-end gap-3 mt-6">
            {showCancel && (
              <button
                onClick={onCancel || onClose}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                {cancelText}
              </button>
            )}
            {showConfirm && (
              <button onClick={onConfirm} className={confirmButtonClass}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
