"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { RevenueAnalytics } from "@/app/lib/services/analytics";
import { useResponsiveChart } from "./hooks/useResponsiveChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RevenueChartsProps {
  data: RevenueAnalytics;
}

export function MonthlyRevenueChart({ data }: RevenueChartsProps) {
  const { getResponsiveOptions } = useResponsiveChart();

  const chartData = {
    labels: data.monthlyRevenue.map((item) => item.month),
    datasets: [
      {
        label: "Revenue ($)",
        data: data.monthlyRevenue.map((item) => item.revenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Invoice Count",
        data: data.monthlyRevenue.map((item) => item.invoiceCount),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const baseOptions = {
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
        text: "Monthly Revenue Trend",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Invoice Count",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const options = getResponsiveOptions(baseOptions);

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-3 sm:p-6">
      <div className="h-64 sm:h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export function RevenueByStatusChart({ data }: RevenueChartsProps) {
  const chartData = {
    labels: data.revenueByStatus.map(
      (item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        data: data.revenueByStatus.map((item) => item.amount),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // paid - green
          "rgba(249, 115, 22, 0.8)", // sent - orange
          "rgba(156, 163, 175, 0.8)", // draft - gray
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(156, 163, 175, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Revenue by Invoice Status",
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
            const total = data.revenueByStatus.reduce(
              (sum, item) => sum + item.amount,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
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

export function RevenueOverviewChart({ data }: RevenueChartsProps) {
  const chartData = {
    labels: ["Total Revenue", "Avg Invoice Value", "YoY Growth %"],
    datasets: [
      {
        label: "Revenue Metrics",
        data: [
          data.totalRevenue,
          data.averageInvoiceValue,
          data.yearOverYearGrowth,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 101, 101, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 101, 101, 1)",
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
        text: "Revenue Overview",
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

            if (label === "YoY Growth %") {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: $${value.toLocaleString()}`;
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

export function MonthlyRevenueTrendChart({ data }: RevenueChartsProps) {
  const { getResponsiveOptions } = useResponsiveChart();

  const chartData = {
    labels: data.monthlyRevenueTrend.map((item) => item.month),
    datasets: [
      {
        label: "Paid Revenue",
        data: data.monthlyRevenueTrend.map((item) => item.paid),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
      },
      {
        label: "Unpaid Revenue",
        data: data.monthlyRevenueTrend.map((item) => item.unpaid),
        backgroundColor: "rgba(245, 158, 11, 0.8)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1,
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
        text: "Monthly Revenue Trend (Paid vs Unpaid)",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: {
            dataset: { label?: string };
            parsed: { y: number };
          }) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: $${value.toLocaleString()}`;
          },
          footer: function (tooltipItems: { dataIndex: number }[]) {
            const monthData =
              data.monthlyRevenueTrend[tooltipItems[0].dataIndex];
            return `Total: $${monthData.total.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
        ticks: {
          callback: function (value: string | number) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const options = getResponsiveOptions(baseOptions);

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-3 sm:p-6">
      <div className="h-64 sm:h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
