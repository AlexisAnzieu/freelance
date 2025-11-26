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
    e.preventDefault(); // Always prevent the default form submission

    // Capture the form reference before any async operations
    const form = e.currentTarget.closest("form");

    try {
      const confirmed = await showConfirm(
        `Are you sure you want to delete this ${itemName}?`,
        `Delete ${itemName}`
      );
      if (confirmed && form) {
        // Manually submit the form if confirmed
        form.requestSubmit();
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={pending}
        className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors duration-100 cursor-pointer
        ${
          pending
            ? "animate-pulse cursor-wait bg-[#fde8e8]"
            : "bg-[#fde8e8] hover:bg-[#fbd5d5]"
        } 
        disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={handleDelete}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="h-3.5 w-3.5 text-[#eb5757]" aria-hidden="true" />
      </button>
    </>
  );
}
