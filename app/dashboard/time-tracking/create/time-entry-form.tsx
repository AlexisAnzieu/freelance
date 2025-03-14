"use client";

import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/ui/modal-context";
import { useState, FormEvent } from "react";
import { createTimeEntry } from "./actions";

interface TimeEntryFormProps {
  project: Project;
  onSuccess?: () => void;
}

export default function TimeEntryForm({
  project,
  onSuccess,
}: TimeEntryFormProps) {
  const router = useRouter();
  const { showError } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    hours: "",
    hourlyRate: "0",
  });
  const [errors, setErrors] = useState<{
    date?: { message: string };
    description?: { message: string };
    hours?: { message: string };
    hourlyRate?: { message: string };
  }>({});

  const validateForm = () => {
    const newErrors: {
      date?: { message: string };
      description?: { message: string };
      hours?: { message: string };
      hourlyRate?: { message: string };
    } = {};

    if (!formData.date) newErrors.date = { message: "Date is required" };
    if (!formData.description)
      newErrors.description = { message: "Description is required" };
    if (!formData.hours) {
      newErrors.hours = { message: "Duration is required" };
    } else if (!/^\d*\.?\d*$/.test(formData.hours)) {
      newErrors.hours = { message: "Please enter a valid number" };
    }
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = { message: "Hourly rate is required" };
    } else if (!/^\d*\.?\d*$/.test(formData.hourlyRate)) {
      newErrors.hourlyRate = { message: "Please enter a valid number" };
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createTimeEntry({
        projectId: project.id,
        date: new Date(formData.date),
        description: formData.description,
        hours: parseFloat(formData.hours),
        hourlyRate: parseFloat(formData.hourlyRate),
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        router.push(`/dashboard/projects/${project.id}`);
      }
    } catch (error) {
      showError("Failed to create time entry");
      console.error("Failed to create time entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDurationInput = (value: string) => {
    if (value.endsWith("h")) {
      setFormData((prev) => ({
        ...prev,
        hours: value.slice(0, -1),
      }));
    } else if (value.endsWith("m")) {
      setFormData((prev) => ({
        ...prev,
        hours: (parseInt(value.slice(0, -1)) / 60).toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        hours: value,
      }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 transition-all duration-300 ease-in-out"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="group rounded-xl p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-blue-600"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm
                      transition-all duration-300 ease-out
                      focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/70
                      hover:border-blue-300 hover:shadow-md
                      group-hover:shadow-md"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="group rounded-xl p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30">
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-blue-600"
          >
            Duration (hours)
          </label>
          <input
            type="text"
            id="hours"
            value={formData.hours}
            onChange={(e) => handleDurationInput(e.target.value)}
            placeholder="e.g. 1.5 or 90m"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm
                      transition-all duration-300 ease-out
                      focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/70
                      hover:border-blue-300 hover:shadow-md
                      group-hover:shadow-md"
          />
          {errors.hours && (
            <p className="mt-1 text-sm text-red-600 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
              {errors.hours.message}
            </p>
          )}
        </div>
      </div>

      <div className="group rounded-xl p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-blue-600"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm
                    transition-all duration-300 ease-out
                    focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/70
                    hover:border-blue-300 hover:shadow-md
                    group-hover:shadow-md
                    resize-none"
          placeholder="What did you work on?"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="group rounded-xl p-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30">
        <label
          htmlFor="hourlyRate"
          className="block text-sm font-medium text-gray-700 transition-all duration-300 group-hover:text-blue-600"
        >
          Hourly Rate
        </label>
        <div className="mt-1 relative rounded-md shadow-sm group-hover:shadow-md transition-all duration-300">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm transition-colors duration-300 group-hover:text-blue-600">
              $
            </span>
          </div>
          <input
            type="text"
            id="hourlyRate"
            value={formData.hourlyRate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hourlyRate: e.target.value }))
            }
            className="block w-full pl-7 rounded-md border border-gray-300 bg-white/80 py-2 shadow-sm backdrop-blur-sm
                      transition-all duration-300 ease-out
                      focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/70
                      hover:border-blue-300 hover:shadow-md
                      group-hover:shadow-md"
            placeholder="0.00"
          />
        </div>
        {errors.hourlyRate && (
          <p className="mt-1 text-sm text-red-600 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            {errors.hourlyRate.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white/90 
                   border border-gray-200 rounded-lg backdrop-blur-sm shadow-sm 
                   transition-all duration-300 ease-out
                   hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/50
                   active:scale-[0.98]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-5 py-2.5 text-sm font-medium 
                   text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg
                   shadow-sm hover:shadow-blue-500/20 hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500/50
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-blue-400
                   transition-all duration-300 ease-out
                   hover:scale-[1.03] active:scale-[0.98]
                   group"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <span>Save Time Entry</span>
              <svg
                className="ml-2 h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
