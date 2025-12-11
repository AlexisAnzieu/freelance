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
    shadowHours: number;
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
    const shadowHoursValue = formData.get("shadowHours") as string;
    const hoursValue = parseFloat(formData.get("hours") as string);
    const data = {
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      hours: hoursValue,
      shadowHours: shadowHoursValue ? parseFloat(shadowHoursValue) : hoursValue,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
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
          className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-[#37352f] text-sm focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          defaultValue={initialData?.description}
          rows={3}
          className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-[#37352f] text-sm focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="hours"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Billable Hours
        </label>
        <input
          type="number"
          name="hours"
          id="hours"
          step="0.25"
          min="0"
          required
          defaultValue={initialData?.hours}
          className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-[#37352f] text-sm focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="shadowHours"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Actual Hours (Internal)
        </label>
        <input
          type="number"
          name="shadowHours"
          id="shadowHours"
          step="0.25"
          min="0"
          defaultValue={initialData?.shadowHours}
          placeholder="Defaults to billable hours if empty"
          className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-[#37352f] text-sm focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
        />
        <p className="mt-1 text-xs text-[#9b9a97]">
          Actual time spent (won&apos;t appear on invoices)
        </p>
      </div>

      <div>
        <label
          htmlFor="hourlyRate"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Hourly Rate
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-[#9b9a97] text-sm">
              {CURRENCIES[projectCurrency as keyof typeof CURRENCIES]?.symbol ||
                "$"}
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
            className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 pl-7 pr-3 text-[#37352f] text-sm focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#2383e2] hover:bg-[#1a73d4] focus:outline-none transition-colors disabled:bg-[#9b9a97] disabled:cursor-not-allowed"
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
