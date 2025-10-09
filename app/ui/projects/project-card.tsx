"use client";

import { Project } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/app/lib/constants";
import { useModal } from "../modal-context";
import SidePanel from "../side-panel";
import TimeEntryForm from "@/app/dashboard/time-tracking/create/time-entry-form";

export interface ProjectWithCompanies extends Project {
  companies: { companyName: string }[];
  timeEntries: {
    id: string;
    hours: number;
    hourlyRate: number;
    invoiceItemId: string | null;
    invoiceItem?: {
      invoice?: {
        status: string;
      } | null;
    } | null;
  }[];
  _count?: {
    timeEntries: number;
    invoicedTimeEntries: number;
  };
}

export default function ProjectCard({
  project,
  onDelete,
}: {
  project: ProjectWithCompanies;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTimeEntryPanelOpen, setIsTimeEntryPanelOpen] = useState(false);
  const router = useRouter();

  const { showConfirm, showError } = useModal();

  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this project?",
      "Delete Project"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(project.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
      showError("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:scale-[1.01] transition-transform duration-300">
                  {project.name}
                </h3>
                <span className="text-sm px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/10">
                  {
                    CURRENCIES[project.currency as keyof typeof CURRENCIES]
                      ?.symbol
                  }{" "}
                  {project.currency}
                </span>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-500 group-hover:hidden transition-opacity duration-200">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="hidden group-hover:flex gap-2 transition-opacity duration-200">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="relative p-1.5 text-blue-600/70 hover:text-blue-600 transition-colors duration-300"
                    aria-label="Edit project"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="relative p-1.5 text-red-600/70 hover:text-red-600 disabled:opacity-50 transition-colors duration-300"
                    aria-label="Delete project"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {project.description && (
            <p className="text-gray-600/90 mb-4 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
              {project.description}
            </p>
          )}

          {project.companies && project.companies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.companies.map((company, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/20"
                  >
                    {company.companyName}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-4 hover:from-blue-100 hover:to-purple-100 transition-all duration-300">
            <div className="absolute inset-0 bg-grid-black/[0.03] bg-[size:6px]" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {(
                    ((project._count?.invoicedTimeEntries || 0) /
                      (project._count?.timeEntries || 1)) *
                    100
                  ).toFixed(0)}
                  %
                </span>
                <span className="text-sm text-gray-600">invoiced</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  {project._count?.timeEntries || 0} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTimeEntryPanelOpen(true)}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-1.5 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                    title="Add time entry"
                    aria-label="Add time entry"
                  >
                    <div className="absolute inset-0 bg-grid-black/[0.03] bg-[size:6px]" />
                    <svg
                      className="w-4 h-4 text-purple-600 relative"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/time-tracking/${project.id}`)
                    }
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-1.5 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                    title="View time entries"
                    aria-label="View time entries"
                  >
                    <div className="absolute inset-0 bg-grid-black/[0.03] bg-[size:6px]" />
                    <svg
                      className="w-4 h-4 text-purple-600 relative"
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
                  </button>
                </div>
              </div>
            </div>

            <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:opacity-80"
                style={{
                  width: `${(
                    ((project._count?.invoicedTimeEntries || 0) /
                      (project._count?.timeEntries || 1)) *
                    100
                  ).toFixed(0)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <SidePanel
        isOpen={isTimeEntryPanelOpen}
        onClose={() => setIsTimeEntryPanelOpen(false)}
        title="Add Time Entry"
      >
        <TimeEntryForm
          projectId={project.id}
          projectCurrency={project.currency}
          onSuccess={() => {
            setIsTimeEntryPanelOpen(false);
            router.refresh();
          }}
        />
      </SidePanel>
    </>
  );
}
