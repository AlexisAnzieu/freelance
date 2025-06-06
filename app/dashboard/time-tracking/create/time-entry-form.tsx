"use client";

import { createTimeEntry } from "./actions";
import { updateTimeEntry } from "../[id]/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CURRENCIES } from "@/app/lib/constants";

interface Props {
  projectId: string;
  projectCurrency?: string;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    date: Date;
    description: string;
    hours: number;
    hourlyRate: number;
  };
}

export default function TimeEntryForm({
  projectId,
  projectCurrency = "CAD",
  onSuccess,
  initialData,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      hours: parseFloat(formData.get("hours") as string),
      hourlyRate: parseFloat(formData.get("hourlyRate") as string),
      projectId,
    };

    try {
      if (initialData) {
        await updateTimeEntry(initialData.id, data);
      } else {
        await createTimeEntry(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        router.push(`/dashboard/time-tracking/${projectId}`);
      }
    } catch (error) {
      console.error("Failed to create time entry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          required
          defaultValue={
            initialData
              ? new Date(initialData.date).toISOString().split("T")[0]
              : undefined
          }
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          defaultValue={initialData?.description}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="hours"
          className="block text-sm font-medium text-gray-700"
        >
          Hours
        </label>
        <input
          type="number"
          name="hours"
          id="hours"
          step="0.25"
          min="0"
          required
          defaultValue={initialData?.hours}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="hourlyRate"
          className="block text-sm font-medium text-gray-700"
        >
          Hourly Rate
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">
              {CURRENCIES[projectCurrency as keyof typeof CURRENCIES]?.symbol || "$"}
            </span>
          </div>
          <input
            type="number"
            name="hourlyRate"
            id="hourlyRate"
            min="0"
            step="0.01"
            required
            defaultValue={initialData?.hourlyRate}
            className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {submitting
            ? "Saving..."
            : initialData
            ? "Update Time Entry"
            : "Create Time Entry"}
        </button>
      </div>
    </form>
  );
}
