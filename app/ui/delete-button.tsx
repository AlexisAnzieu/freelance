"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

interface DeleteButtonProps {
  itemName: string;
}

export function DeleteButton({ itemName }: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={(e) => {
        if (!confirm(`Are you sure you want to delete this ${itemName}?`)) {
          e.preventDefault();
        }
      }}
    >
      <span className="sr-only">Delete</span>
      <TrashIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
