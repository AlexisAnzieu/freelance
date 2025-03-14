"use client";

import { TimeTracking } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/app/ui/modal-context";
import { deleteTimeEntry } from "./actions";

interface TimeTrackingWithItems extends TimeTracking {
  items: {
    id: string;
    date: Date;
    description: string;
    hours: number;
    hourlyRate: number;
  }[];
}

export default function TimeEntriesTable({
  timeTrackingList,
}: {
  timeTrackingList: TimeTrackingWithItems[];
}) {
  const router = useRouter();
  const { showConfirm, showError } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const allTimeEntries = timeTrackingList.flatMap((t) => t.items);
  const sortedEntries = [...allTimeEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (entryId: string) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this time entry?",
      "Delete Time Entry"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteTimeEntry(entryId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete time entry:", error);
      showError("Failed to delete time entry");
    } finally {
      setIsDeleting(false);
    }
  };

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No time entries
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new time entry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Hours
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Rate
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Amount
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedEntries.map((entry) => (
            <tr key={entry.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                {entry.description}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {entry.hours}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                ${entry.hourlyRate.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                ${(entry.hours * entry.hourlyRate).toFixed(2)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete<span className="sr-only">, {entry.description}</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
