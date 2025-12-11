import { auth } from "@/auth";
import {
  getRevenueAnalytics,
  getTimeTrackingAnalytics,
  getDateRangeFromDates,
  DateFilter,
} from "@/app/lib/services/analytics";
import { MonthlyRevenueTrendChart } from "@/app/ui/dashboard/revenue-charts";
import {
  ShadowHoursByProjectChart,
  MonthlyHoursChart,
  HoursDistributionChart,
} from "@/app/ui/dashboard/time-tracking-charts";
import { DashboardFilters } from "@/app/ui/dashboard/dashboard-filters";
import prisma from "@/app/lib/prisma";

interface StatCardProps {
  title: string;
  value: string;
  color: "green" | "blue" | "orange";
  icon: string;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const colorClasses = {
    green: "text-[#00a67d] bg-[#e8f5ee]",
    blue: "text-[#2eaadc] bg-[#e8f4fd]",
    orange: "text-[#ffa344] bg-[#fef3e2]",
  };

  return (
    <div className="rounded-md border border-[#e8e8e8] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#787774] truncate">{title}</p>
          <p
            className={`text-xl font-semibold ${
              colorClasses[color].split(" ")[0]
            } truncate mt-1`}
          >
            {value}
          </p>
        </div>
        <div
          className={`rounded-md p-2 ${colorClasses[color]} ml-3 flex-shrink-0`}
        >
          <div className="h-4 w-4" dangerouslySetInnerHTML={{ __html: icon }} />
        </div>
      </div>
    </div>
  );
}

async function getDashboardData(
  contractorId?: string,
  dateFilter?: DateFilter
) {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const [revenueData, timeTrackingData, contractors] = await Promise.all([
    getRevenueAnalytics(session.teamId, contractorId, dateFilter),
    getTimeTrackingAnalytics(session.teamId, contractorId, dateFilter),
    prisma.company.findMany({
      where: {
        teamId: session.teamId,
        types: { some: { name: "contractor" } },
      },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
  ]);

  return {
    revenueData,
    timeTrackingData,
    contractors,
  };
}

interface EnhancedDashboardProps {
  contractorId?: string;
  startDate?: string;
  endDate?: string;
}

export default async function EnhancedDashboard({
  contractorId,
  startDate,
  endDate,
}: EnhancedDashboardProps) {
  const dateFilter = getDateRangeFromDates(startDate, endDate);
  const { revenueData, timeTrackingData, contractors } = await getDashboardData(
    contractorId,
    dateFilter
  );

  const totalRevenue = revenueData.revenueByStatus.reduce(
    (total: number, item: { amount: number }) => total + item.amount,
    0
  );
  const outstanding = totalRevenue - revenueData.totalRevenue;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#37352f]">Dashboard</h1>
          <p className="text-sm text-[#787774] mt-1">
            Comprehensive business insights
          </p>
        </div>
        <DashboardFilters contractors={contractors} />
      </div>

      {/* Revenue Overview */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
        <div className="rounded-md border border-[#e8e8e8] bg-white p-4">
          <MonthlyRevenueTrendChart data={revenueData} />
        </div>
      </div>

      {/* Time Tracking */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#37352f] mb-4">
          Time Tracking
        </h2>
        <div className="rounded-md border border-[#e8e8e8] bg-white p-4 mb-4">
          <ShadowHoursByProjectChart data={timeTrackingData} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-md border border-[#e8e8e8] bg-white p-4">
            <MonthlyHoursChart data={timeTrackingData} />
          </div>
          <div className="rounded-md border border-[#e8e8e8] bg-white p-4">
            <HoursDistributionChart data={timeTrackingData} />
          </div>
        </div>
      </div>
    </div>
  );
}
