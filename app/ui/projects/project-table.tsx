"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CURRENCIES } from "@/app/lib/constants";
import { useModal } from "../modal-context";
import SidePanel from "../side-panel";
import TimeEntryForm from "@/app/dashboard/time-tracking/create/time-entry-form";
import { Project } from "@prisma/client";
import { calculateCostBreakdown, formatCurrencyAmount } from "@/app/lib/utils";

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

export default function ProjectTable({
  projects,
  onDelete,
}: {
  projects: ProjectWithCompanies[];
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [timeEntryProject, setTimeEntryProject] =
    useState<ProjectWithCompanies | null>(null);
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
      <div className="overflow-x-auto rounded-md border border-[#e8e8e8]">
        <div className="w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f7f7f5]">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Currency
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Companies
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Revenue (Not invoiced / Invoiced unpaid / Paid)
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-xs font-medium text-[#787774] uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] bg-white">
              {projects.map((project) => {
                const costBreakdown = calculateCostBreakdown(
                  project.timeEntries || []
                );

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-[#f7f7f5] transition-colors duration-75 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/time-tracking/${project.id}`)
                    }
                  >
                    <td className="px-4 py-3 w-40">
                      <span className="font-medium text-[#37352f] truncate block">
                        {project.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#e8f4fd] text-[#2eaadc] border border-[#d3ebf9]">
                        {
                          CURRENCIES[
                            project.currency as keyof typeof CURRENCIES
                          ]?.symbol
                        }{" "}
                        {project.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.companies.map((company, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f1f1f0] text-[#37352f] border border-[#e8e8e8]"
                          >
                            {company.companyName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#787774]">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#fde8e8] text-[#eb5757] border border-[#fbd5d5]">
                          {formatCurrencyAmount(
                            costBreakdown.notInvoiced,
                            project.currency
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#fef3e2] text-[#ffa344] border border-[#fde8c9]">
                          {formatCurrencyAmount(
                            costBreakdown.invoicedUnpaid,
                            project.currency
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#e8f5ee] text-[#00a67d] border border-[#d3ede1]">
                          {formatCurrencyAmount(
                            costBreakdown.paid,
                            project.currency
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="relative w-28">
                      <div className="absolute inset-0 flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimeEntryProject(project);
                          }}
                          className="p-1.5 text-[#9b9a97] hover:text-[#a463f2] transition-colors duration-100"
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
                          className="p-1.5 text-[#9b9a97] hover:text-[#2eaadc] transition-colors duration-100"
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
                          className="p-1.5 text-[#9b9a97] hover:text-[#eb5757] disabled:opacity-50 transition-colors duration-100"
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
                );
              })}
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
