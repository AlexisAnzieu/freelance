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
    "text-base font-semibold mb-3 text-[#37352f]",
    type === "error" && "text-[#eb5757]",
    type === "confirm" && "text-[#2eaadc]"
  );

  const confirmButtonClass = twMerge(
    "px-3 py-1.5 rounded text-sm font-medium transition-colors duration-100",
    type === "error" && "bg-[#eb5757] hover:bg-[#d94848] text-white",
    type === "confirm" && "bg-[#2eaadc] hover:bg-[#2799c7] text-white",
    type === "info" && "bg-[#37352f] hover:bg-[#2b2926] text-white"
  );

  return createPortal(
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="animate-modal-appear w-full max-w-md bg-white rounded-md shadow-lg p-5 mx-4 border border-[#e8e8e8]">
        {title && (
          <h2 id="modal-title" className={headerClass}>
            {title}
          </h2>
        )}
        <div className="text-sm text-[#787774]">{children}</div>
        {(showCancel || showConfirm) && (
          <div className="flex justify-end gap-2 mt-5">
            {showCancel && (
              <button
                onClick={onCancel || onClose}
                className="px-3 py-1.5 rounded text-sm font-medium text-[#787774] hover:text-[#37352f] hover:bg-[#f1f1f0] transition-colors duration-100"
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
