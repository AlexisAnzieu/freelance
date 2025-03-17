"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";
import { useModal } from "./modal-context";

interface DeleteButtonProps {
  itemName: string;
}

export function DeleteButton({ itemName }: DeleteButtonProps) {
  const { pending } = useFormStatus();
  const { showConfirm } = useModal();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const confirmed = await showConfirm(
        `Are you sure you want to delete this ${itemName}?`,
        `Delete ${itemName}`
      );
      if (!confirmed) {
        e.preventDefault(); // Only prevent form submission if not confirmed
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
      e.preventDefault(); // Prevent form submission on error
    }
  };

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 transition-all duration-200 cursor-pointer
        ${
          pending
            ? "animate-pulse cursor-wait bg-red-100 ring-red-400"
            : "hover:bg-red-100 hover:text-red-700 hover:shadow-sm hover:ring-1 hover:ring-red-400/50 active:bg-red-200"
        } 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50`}
        onClick={handleDelete}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="h-4 w-4 text-red-600" aria-hidden="true" />
      </button>
    </>
  );
}
