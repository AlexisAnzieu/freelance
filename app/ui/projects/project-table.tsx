"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectWithCompanies } from "./project-card";
import { CURRENCIES } from "@/app/lib/constants";
import { useModal } from "../modal-context";
import SidePanel from "../side-panel";
import TimeEntryForm from "@/app/dashboard/time-tracking/create/time-entry-form";

export default function ProjectTable({
  projects,
  onDelete,
}: {
  projects: ProjectWithCompanies[];
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [timeEntryProject, setTimeEntryProject] = useState<ProjectWithCompanies | null>(null);
  const router = useRouter();
  const { showConfirm, showError } = useModal();

  const handleDelete = async (project: ProjectWithCompanies) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this project?",
      "Delete Project"
    );
    if (!confirmed) return;

    setIsDeleting(project.id);
    try {
      await onDelete(project.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
      showError("Failed to delete project");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto rounded-2xl bg-white/50 backdrop-blur-xl shadow-lg border border-white/10">
        <div className="w-full">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Currency
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 w-64">
                  Companies
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Created
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Progress
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="group border-t border-gray-200 hover:bg-gradient-to-br hover:from-blue-500/5 hover:via-transparent hover:to-purple-500/5 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/time-tracking/${project.id}`)}
                >
                  <td className="px-6 py-4 w-40">
                    <span className="font-semibold text-gray-900 truncate block">
                      {project.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/10">
                      {CURRENCIES[project.currency as keyof typeof CURRENCIES]?.symbol} {project.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {project.companies.map((company, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border border-blue-500/10"
                        >
                          {company.companyName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">
                            {project._count?.timeEntries || 0} entries
                          </span>
                          <span className="font-medium text-blue-700">
                            {(
                              ((project._count?.invoicedTimeEntries || 0) /
                                (project._count?.timeEntries || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
                  </td>
                  <td className="relative w-32">
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimeEntryProject(project);
                        }}
                        className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Add time entry"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit project"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project);
                        }}
                        disabled={isDeleting === project.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                        title="Delete project"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {timeEntryProject && (
        <SidePanel
          isOpen={true}
          onClose={() => setTimeEntryProject(null)}
          title="Add Time Entry"
        >
          <TimeEntryForm
            projectId={timeEntryProject.id}
            projectCurrency={timeEntryProject.currency}
            onSuccess={() => {
              setTimeEntryProject(null);
              router.refresh();
            }}
          />
        </SidePanel>
      )}
    </>
  );
}
