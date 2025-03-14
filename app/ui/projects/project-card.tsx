"use client";

import { Project } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectWithCompanies extends Project {
  companies: { companyName: string }[];
  _count?: {
    timeTracking: number;
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
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsDeleting(true);
    try {
      await onDelete(project.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:scale-[1.01] transition-transform duration-300">
            {project.name}
          </h3>
          <div className="flex space-x-2">
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="relative p-2 text-blue-600 hover:text-blue-500 transition-colors duration-300 hover:scale-110 transform"
              aria-label="Edit project"
            >
              <svg
                className="w-5 h-5"
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
              className="relative p-2 text-red-600 hover:text-red-500 disabled:opacity-50 transition-colors duration-300 hover:scale-110 transform"
              aria-label="Delete project"
            >
              <svg
                className="w-5 h-5"
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

        {project.description && (
          <p className="text-gray-600/90 mb-6 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
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

        <div className="mt-6 flex justify-between items-center text-sm font-medium">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gradient-to-r from-blue-500/5 to-purple-500/5 px-3 py-1 rounded-full border border-blue-500/10">
              <svg
                className="w-4 h-4 mr-1.5 text-blue-600/80"
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
              <span>{project._count?.timeTracking || 0} Time entries</span>
            </div>
            <div className="text-gray-500/80">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
