"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bubble, Line } from "react-chartjs-2";
import { TimeTrackingAnalytics } from "@/app/lib/services/analytics";
import { useResponsiveChart } from "./hooks/useResponsiveChart";
import { getProjectColorByHex } from "@/app/lib/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface TimeTrackingChartsProps {
  data: TimeTrackingAnalytics;
}

export function ShadowHoursByProjectChart({ data }: TimeTrackingChartsProps) {
  const { getResponsiveOptions } = useResponsiveChart();

  // Calculate hourly rates and sort projects by shadow hours
  const projectsWithRates = data.hoursByProject
    .map((item) => ({
      ...item,
      hourlyRate: item.shadowHours > 0 ? item.revenue / item.shadowHours : 0,
    }))
    .sort((a, b) => b.shadowHours - a.shadowHours);

  // Normalize bubble sizes (radius between 5 and 30)
  const maxRevenue = Math.max(...projectsWithRates.map((p) => p.revenue), 1);
  const minRadius = 5;
  const maxRadius = 30;

  const chartData = {
    datasets: projectsWithRates.map((item) => {
      const color = getProjectColorByHex(item.projectColor);
      return {
        label: item.projectName,
        data: [
          {
            x: item.shadowHours,
            y: item.hourlyRate,
            r:
              minRadius +
              ((item.revenue / maxRevenue) * (maxRadius - minRadius) ||
                minRadius),
          },
        ],
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2,
      };
    }),
  };

  const baseOptions = {
    interaction: {
      mode: "nearest" as const,
      intersect: true,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Hours vs Rate (bubble size = revenue)",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: {
            dataset: { label: string };
            parsed: { x: number; y: number };
            raw: { r: number };
          }) {
            const project = projectsWithRates.find(
              (p) => p.projectName === context.dataset.label
            );
            if (!project) return "";
            const realRate =
              project.shadowHours > 0
                ? project.revenue / project.shadowHours
                : 0;
            return [
              `${project.projectName}`,
              `Actual Hours: ${project.shadowHours.toFixed(1)}h`,
              `Billed Hours: ${project.billedHours.toFixed(1)}h`,
              `Efficiency: ${
                project.shadowHours > 0
                  ? ((project.billedHours / project.shadowHours) * 100).toFixed(
                      0
                    )
                  : 0
              }%`,
              `Revenue: $${project.revenue.toLocaleString()}`,
              `Real Rate: $${realRate.toFixed(2)}/h`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Actual Hours Worked",
        },
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Effective Rate ($)",
        },
        ticks: {
          callback: function (value: string | number) {
            return "$" + Number(value).toFixed(0);
          },
        },
      },
    },
  };

  const options = getResponsiveOptions(baseOptions);

  return (
    <div className="h-64 sm:h-80">
      <Bubble data={chartData} options={options} />
    </div>
  );
}

export function MonthlyHoursChart({ data }: TimeTrackingChartsProps) {
  const { getResponsiveOptions } = useResponsiveChart();

  const chartData = {
    labels: data.hoursByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Billed Hours",
        data: data.hoursByMonth.map((item) => item.billedHours),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Actual Hours Worked",
        data: data.hoursByMonth.map((item) => item.shadowHours),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const baseOptions = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Hours Tracked - Billed vs Actual",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
  };

  const options = getResponsiveOptions(baseOptions);

  return (
    <div className="h-64 sm:h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function ProjectsByHourlyRateList({ data }: TimeTrackingChartsProps) {
  // Calculate hourly rates and sort by descending rate
  const projectsWithRates = data.hoursByProject
    .map((item) => ({
      ...item,
      hourlyRate: item.shadowHours > 0 ? item.revenue / item.shadowHours : 0,
    }))
    .sort((a, b) => b.hourlyRate - a.hourlyRate);

  return (
    <div>
      <h3 className="text-base font-semibold text-[#37352f] mb-4">
        Projects by Hourly Rate
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {projectsWithRates.map((project, index) => {
          const color = getProjectColorByHex(project.projectColor);
          return (
            <div
              key={project.projectName}
              className="flex items-center justify-between p-3 rounded-md border border-[#e8e8e8] hover:bg-[#f7f6f3] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-[#9b9a97] w-6">
                  #{index + 1}
                </span>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.border }}
                />
                <span className="text-sm font-medium text-[#37352f] truncate">
                  {project.projectName}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#00a67d]">
                    ${project.hourlyRate.toFixed(2)}/h
                  </p>
                  <p className="text-xs text-[#9b9a97]">
                    {project.shadowHours.toFixed(1)}h worked
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {projectsWithRates.length === 0 && (
          <p className="text-sm text-[#9b9a97] text-center py-4">
            No time entries found
          </p>
        )}
      </div>
    </div>
  );
}

export function ProjectsByEfficiencyList({ data }: TimeTrackingChartsProps) {
  // Calculate efficiency (billed hours / shadow hours * 100) and sort by descending efficiency
  const projectsWithEfficiency = data.hoursByProject
    .map((item) => ({
      ...item,
      efficiency:
        item.shadowHours > 0 ? (item.billedHours / item.shadowHours) * 100 : 0,
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div>
      <h3 className="text-base font-semibold text-[#37352f] mb-4">
        Projects by Efficiency
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {projectsWithEfficiency.map((project, index) => {
          const color = getProjectColorByHex(project.projectColor);
          // Color code efficiency: green >= 100%, yellow 80-99%, red < 80%
          const efficiencyColor =
            project.efficiency >= 100
              ? "text-[#00a67d]"
              : project.efficiency >= 80
              ? "text-[#ffa344]"
              : "text-[#eb5757]";
          return (
            <div
              key={project.projectName}
              className="flex items-center justify-between p-3 rounded-md border border-[#e8e8e8] hover:bg-[#f7f6f3] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-[#9b9a97] w-6">
                  #{index + 1}
                </span>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.border }}
                />
                <span className="text-sm font-medium text-[#37352f] truncate">
                  {project.projectName}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${efficiencyColor}`}>
                    {project.efficiency.toFixed(0)}%
                  </p>
                  <p className="text-xs text-[#9b9a97]">
                    {project.billedHours.toFixed(1)}h /{" "}
                    {project.shadowHours.toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {projectsWithEfficiency.length === 0 && (
          <p className="text-sm text-[#9b9a97] text-center py-4">
            No time entries found
          </p>
        )}
      </div>
    </div>
  );
}

export function ProjectsByRevenueList({ data }: TimeTrackingChartsProps) {
  // Sort projects by revenue descending
  const projectsByRevenue = [...data.hoursByProject].sort(
    (a, b) => b.revenue - a.revenue
  );

  return (
    <div>
      <h3 className="text-base font-semibold text-[#37352f] mb-4">
        Projects by Revenue
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {projectsByRevenue.map((project, index) => {
          const color = getProjectColorByHex(project.projectColor);
          return (
            <div
              key={project.projectName}
              className="flex items-center justify-between p-3 rounded-md border border-[#e8e8e8] hover:bg-[#f7f6f3] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-medium text-[#9b9a97] w-6">
                  #{index + 1}
                </span>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.border }}
                />
                <span className="text-sm font-medium text-[#37352f] truncate">
                  {project.projectName}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2eaadc]">
                    ${project.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#9b9a97]">
                    {project.billedHours.toFixed(1)}h billed
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {projectsByRevenue.length === 0 && (
          <p className="text-sm text-[#9b9a97] text-center py-4">
            No time entries found
          </p>
        )}
      </div>
    </div>
  );
}
