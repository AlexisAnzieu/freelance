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
import { Bar } from "react-chartjs-2";
import { InvoiceAnalytics } from "@/app/lib/services/analytics";

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

interface InvoiceChartsProps {
  data: InvoiceAnalytics;
}

export function InvoiceStatusChart({ data }: InvoiceChartsProps) {
  const chartData = {
    labels: data.invoiceStatusDistribution.map(
      (item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        label: "Invoice Count",
        data: data.invoiceStatusDistribution.map((item) => item.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Total Amount ($)",
        data: data.invoiceStatusDistribution.map((item) => item.amount),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        yAxisID: "y1",
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
        text: "Invoice Status Distribution",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Invoice Status",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Count",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Amount ($)",
        },
        grid: {
          drawOnChartArea: false,
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

export function PaymentTrendsChart({ data }: InvoiceChartsProps) {
  const chartData = {
    labels: data.paymentTrends.map((item) => item.month),
    datasets: [
      {
        label: "Payments Received ($)",
        data: data.paymentTrends.map((item) => item.paid),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
      {
        label: "Outstanding ($)",
        data: data.paymentTrends.map((item) => item.outstanding),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
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
        text: "Payment Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
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
