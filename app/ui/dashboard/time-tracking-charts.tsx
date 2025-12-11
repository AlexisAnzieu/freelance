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
import { Bubble, Line, Doughnut } from "react-chartjs-2";
import { TimeTrackingAnalytics } from "@/app/lib/services/analytics";
import { useResponsiveChart } from "./hooks/useResponsiveChart";

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

  // Color palette for projects
  const colors = [
    { bg: "rgba(239, 68, 68, 0.7)", border: "rgba(239, 68, 68, 1)" },
    { bg: "rgba(249, 115, 22, 0.7)", border: "rgba(249, 115, 22, 1)" },
    { bg: "rgba(234, 179, 8, 0.7)", border: "rgba(234, 179, 8, 1)" },
    { bg: "rgba(34, 197, 94, 0.7)", border: "rgba(34, 197, 94, 1)" },
    { bg: "rgba(6, 182, 212, 0.7)", border: "rgba(6, 182, 212, 1)" },
    { bg: "rgba(59, 130, 246, 0.7)", border: "rgba(59, 130, 246, 1)" },
    { bg: "rgba(147, 51, 234, 0.7)", border: "rgba(147, 51, 234, 1)" },
    { bg: "rgba(236, 72, 153, 0.7)", border: "rgba(236, 72, 153, 1)" },
    { bg: "rgba(107, 114, 128, 0.7)", border: "rgba(107, 114, 128, 1)" },
    { bg: "rgba(20, 184, 166, 0.7)", border: "rgba(20, 184, 166, 1)" },
  ];

  const chartData = {
    datasets: projectsWithRates.map((item, index) => ({
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
      backgroundColor: colors[index % colors.length].bg,
      borderColor: colors[index % colors.length].border,
      borderWidth: 2,
    })),
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
        text: "Actual Hours Worked - Hours vs Rate (bubble size = revenue)",
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

export function HoursDistributionChart({ data }: TimeTrackingChartsProps) {
  const { getResponsiveOptions, isMobile } = useResponsiveChart();

  const chartData = {
    labels: data.hoursByProject.map((item) => item.projectName),
    datasets: [
      {
        data: data.hoursByProject.map((item) => item.shadowHours),
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

  const baseOptions = {
    plugins: {
      legend: {
        position: isMobile ? ("bottom" as const) : ("right" as const),
      },
      title: {
        display: true,
        text: "Actual Hours Distribution by Project",
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
              (sum, item) => sum + item.shadowHours,
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

  const options = getResponsiveOptions(baseOptions);

  return (
    <div className="h-64 sm:h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
