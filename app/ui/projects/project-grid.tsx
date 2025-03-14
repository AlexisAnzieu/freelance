import { Project } from "@prisma/client";
import ProjectCard from "./project-card";

interface ProjectWithCompanies extends Project {
  companies: { companyName: string }[];
  _count?: {
    timeTracking: number;
  };
}

export default function ProjectGrid({
  projects,
  onDelete,
}: {
  projects: ProjectWithCompanies[];
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="group/card relative bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        <a
          href="/dashboard/projects/create"
          className="relative block p-6 text-center"
          aria-label="Create new project"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 mb-4 group-hover/card:scale-110 transition-transform duration-500">
            <svg
              className="w-6 h-6 text-blue-600/90 group-hover/card:text-blue-700 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 group-hover/card:scale-[1.01] transition-transform duration-300">
            Create New Project
          </h3>
          <p className="text-sm text-gray-500/90 group-hover/card:text-gray-700 transition-colors duration-300">
            Start tracking time for a new project
          </p>
        </a>
      </div>

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
}
