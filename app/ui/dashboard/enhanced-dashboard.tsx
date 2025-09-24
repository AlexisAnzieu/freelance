import { auth } from "@/auth";
import {
  getRevenueAnalytics,
  getTimeTrackingAnalytics,
} from "@/app/lib/services/analytics";
import { MonthlyRevenueTrendChart } from "@/app/ui/dashboard/revenue-charts";
import {
  HoursByProjectChart,
  MonthlyHoursChart,
  HoursDistributionChart,
} from "@/app/ui/dashboard/time-tracking-charts";

interface StatCardProps {
  title: string;
  value: string;
  color: "green" | "blue" | "orange";
  icon: string;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const colorClasses = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    orange: "text-orange-600 bg-orange-100",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{title}</p>
          <p
            className={`text-lg sm:text-xl font-bold ${
              colorClasses[color].split(" ")[0]
            } truncate`}
          >
            {value}
          </p>
        </div>
        <div
          className={`rounded-full p-1.5 sm:p-2 ${colorClasses[color]} ml-2 flex-shrink-0`}
        >
          <div
            className="h-4 w-4 sm:h-5 sm:w-5"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </div>
      </div>
    </div>
  );
}

async function getDashboardData() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const [revenueData, timeTrackingData] = await Promise.all([
    getRevenueAnalytics(session.teamId),
    getTimeTrackingAnalytics(session.teamId),
  ]);

  return {
    revenueData,
    timeTrackingData,
  };
}

export default async function EnhancedDashboard() {
  const { revenueData, timeTrackingData } = await getDashboardData();

  const totalRevenue = revenueData.revenueByStatus.reduce(
    (total: number, item: { amount: number }) => total + item.amount,
    0
  );
  const outstanding = totalRevenue - revenueData.totalRevenue;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive business insights
          </p>
        </div>

        {/* Revenue Overview */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <StatCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              color="blue"
              icon="<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/>"
            />
            <StatCard
              title="Paid Revenue"
              value={`$${revenueData.totalRevenue.toLocaleString()}`}
              color="green"
              icon="<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v12m-3-2.757l3 3 3-3'/>"
            />
            <StatCard
              title="Outstanding"
              value={`$${outstanding.toLocaleString()}`}
              color="orange"
              icon="<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'/>"
            />
          </div>
          <MonthlyRevenueTrendChart data={revenueData} />
        </div>

        {/* Time Tracking */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Time Tracking
          </h2>
          <div className="mb-3 sm:mb-4">
            <HoursByProjectChart data={timeTrackingData} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
            <MonthlyHoursChart data={timeTrackingData} />
            <HoursDistributionChart data={timeTrackingData} />
          </div>
        </div>
      </div>
    </div>
  );
}
