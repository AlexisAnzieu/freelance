"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Modal, ModalProps } from "./modal";

type ModalConfig = Omit<ModalProps, "isOpen" | "onClose">;

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  showError: (message: string, title?: string) => void;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalProps | null>(null);
  const [confirmResolve, setConfirmResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const closeModal = useCallback(() => {
    setModalConfig(null);
    if (confirmResolve) {
      confirmResolve(false);
      setConfirmResolve(null);
    }
  }, [confirmResolve]);

  const showModal = useCallback(
    (config: ModalConfig) => {
      setModalConfig({ ...config, isOpen: true, onClose: closeModal });
    },
    [closeModal]
  );

  const showError = useCallback(
    (message: string, title = "Error") => {
      showModal({
        title,
        children: message,
        type: "error",
        showConfirm: true,
        confirmText: "OK",
      });
    },
    [showModal]
  );

  const showConfirm = useCallback(
    (message: string, title?: string): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmResolve(() => resolve);
        showModal({
          title: title || "Confirm",
          children: message,
          type: "confirm",
          showCancel: true,
          showConfirm: true,
          onConfirm: () => {
            resolve(true);
            closeModal();
          },
          onCancel: () => {
            resolve(false);
            closeModal();
          },
        });
      });
    },
    [showModal, closeModal]
  );

  return (
    <ModalContext.Provider value={{ showModal, showError, showConfirm }}>
      {children}
      {modalConfig && <Modal {...modalConfig} />}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
