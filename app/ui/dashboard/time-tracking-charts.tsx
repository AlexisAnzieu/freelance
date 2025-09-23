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
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TimeTrackingAnalytics } from "@/app/lib/services/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TimeTrackingChartsProps {
  data: TimeTrackingAnalytics;
}

export function HoursByProjectChart({ data }: TimeTrackingChartsProps) {
  // Calculate hourly rates and sort projects by profitability
  const projectsWithRates = data.hoursByProject
    .map((item) => ({
      ...item,
      hourlyRate: item.hours > 0 ? item.revenue / item.hours : 0,
    }))
    .sort((a, b) => b.hourlyRate - a.hourlyRate); // Sort by hourly rate descending

  // Find the most profitable project
  const mostProfitable = projectsWithRates[0];

  const chartData = {
    labels: projectsWithRates.map((item) => item.projectName),
    datasets: [
      {
        label: "Hourly Rate ($/hr)",
        data: projectsWithRates.map((item) => item.hourlyRate),
        backgroundColor: projectsWithRates.map(
          (item, index) =>
            index === 0
              ? "rgba(34, 197, 94, 0.9)" // Green for most profitable
              : item.hourlyRate >= mostProfitable.hourlyRate * 0.8
              ? "rgba(59, 130, 246, 0.8)" // Blue for good rates
              : "rgba(156, 163, 175, 0.6)" // Gray for lower rates
        ),
        borderColor: projectsWithRates.map((item, index) =>
          index === 0
            ? "rgba(34, 197, 94, 1)"
            : item.hourlyRate >= mostProfitable.hourlyRate * 0.8
            ? "rgba(59, 130, 246, 1)"
            : "rgba(156, 163, 175, 1)"
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Project Profitability - Hourly Rate Analysis",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: { dataIndex: number }) {
            const project = projectsWithRates[context.dataIndex];
            return [
              `Hours: ${project.hours.toFixed(1)}h`,
              `Revenue: $${project.revenue.toLocaleString()}`,
              `Efficiency: ${
                project.hourlyRate >= mostProfitable.hourlyRate * 0.8
                  ? "High"
                  : project.hourlyRate >= mostProfitable.hourlyRate * 0.5
                  ? "Medium"
                  : "Low"
              }`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Projects (Sorted by Profitability)",
        },
        ticks: {
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hourly Rate ($)",
        },
        ticks: {
          callback: function (value: string | number) {
            return "$" + Number(value).toFixed(0);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">
            Most Profitable Project
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {mostProfitable?.projectName || "N/A"}
            </div>
            <div className="text-sm text-gray-600">
              ${mostProfitable?.hourlyRate.toFixed(0) || "0"}/hr
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            Most Profitable
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            Good Rate (80%+)
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded mr-1"></div>
            Below Average
          </div>
        </div>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function MonthlyHoursChart({ data }: TimeTrackingChartsProps) {
  const chartData = {
    labels: data.hoursByMonth.map((item) => item.month),
    datasets: [
      {
        label: "Hours Worked",
        data: data.hoursByMonth.map((item) => item.hours),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Hours Tracked",
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

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function ProductivityMetricsChart({ data }: TimeTrackingChartsProps) {
  const chartData = {
    labels: ["Total Hours", "Avg Hourly Rate", "Utilization Rate %"],
    datasets: [
      {
        label: "Productivity Metrics",
        data: [data.totalHours, data.averageHourlyRate, data.utilizationRate],
        backgroundColor: [
          "rgba(245, 101, 101, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(245, 101, 101, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Productivity Overview",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { label: string; parsed: { y: number } }) {
            const label = context.label;
            const value = context.parsed.y;

            if (label === "Utilization Rate %") {
              return `${label}: ${value.toFixed(1)}%`;
            } else if (label === "Avg Hourly Rate") {
              return `${label}: $${value.toFixed(2)}`;
            }
            return `${label}: ${value.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function HoursDistributionChart({ data }: TimeTrackingChartsProps) {
  const chartData = {
    labels: data.hoursByProject.map((item) => item.projectName),
    datasets: [
      {
        data: data.hoursByProject.map((item) => item.hours),
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 101, 101, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 101, 101, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(6, 182, 212, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(168, 85, 247, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Hours Distribution by Project",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { label: string; parsed: number }) {
            const label = context.label || "";
            const value = context.parsed;
            const total = data.hoursByProject.reduce(
              (sum, item) => sum + item.hours,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${label}: ${value.toFixed(1)}h (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
