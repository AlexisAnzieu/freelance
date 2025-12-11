import prisma from "@/app/lib/prisma";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  differenceInMonths,
} from "date-fns";

export interface DateFilter {
  startDate: Date;
  endDate: Date;
}

// Helper function to calculate months between two dates
function getMonthsBetween(startDate: Date, endDate: Date): number {
  const months = differenceInMonths(endDate, startDate) + 1;
  return Math.max(months, 1); // At least 1 month
}

// Helper function to calculate date range from start and end dates
export function getDateRangeFromDates(
  startDate?: string,
  endDate?: string
): DateFilter {
  const now = new Date();

  return {
    startDate: startDate ? new Date(startDate) : subMonths(now, 6),
    endDate: endDate ? new Date(endDate) : now,
  };
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number; invoiceCount: number }[];
  monthlyRevenueTrend: {
    month: string;
    paid: number;
    unpaid: number;
    total: number;
  }[];
  revenueByStatus: { status: string; amount: number; count: number }[];
  averageInvoiceValue: number;
  yearOverYearGrowth: number;
}

export interface TimeTrackingAnalytics {
  totalHours: number;
  hoursByProject: {
    projectName: string;
    projectColor: string;
    shadowHours: number;
    billedHours: number;
    revenue: number;
  }[];
  hoursByMonth: { month: string; shadowHours: number; billedHours: number }[];
  averageHourlyRate: number;
}

export interface ProjectAnalytics {
  projectProfitability: {
    projectName: string;
    revenue: number;
    hours: number;
    profit: number;
    profitMargin: number;
  }[];
  projectsByCompany: {
    companyName: string;
    projectCount: number;
    revenue: number;
  }[];
}

export async function getRevenueAnalytics(
  teamId: string,
  contractorId?: string,
  dateFilter?: DateFilter
): Promise<RevenueAnalytics> {
  const now = new Date();
  const filterStartDate = dateFilter?.startDate;
  const filterEndDate = dateFilter?.endDate;

  // Get all invoices for the team, optionally filtered by contractor and date
  const invoices = await prisma.invoice.findMany({
    where: {
      teamId,
      ...(contractorId && {
        companies: {
          some: {
            id: contractorId,
            types: { some: { name: "contractor" } },
          },
        },
      }),
      ...(filterStartDate &&
        filterEndDate && {
          date: {
            gte: filterStartDate,
            lte: filterEndDate,
          },
        }),
    },
    orderBy: { date: "asc" },
  });

  // Calculate total revenue from paid invoices
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  // Monthly revenue for the filtered period (or last 6 months if no filter)
  const monthlyRevenue = [];
  const monthsToShow =
    filterStartDate && filterEndDate
      ? getMonthsBetween(filterStartDate, filterEndDate)
      : 6;
  const referenceDate = filterEndDate || now;

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(referenceDate, i));
    const monthEnd = endOfMonth(subMonths(referenceDate, i));

    const monthInvoices = invoices.filter(
      (invoice) =>
        invoice.date >= monthStart &&
        invoice.date <= monthEnd &&
        invoice.status === "paid"
    );

    monthlyRevenue.push({
      month: format(monthStart, "MMM yyyy"),
      revenue: monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      invoiceCount: monthInvoices.length,
    });
  }

  // Revenue by status
  const statusGroups = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.status]) {
      acc[invoice.status] = { amount: 0, count: 0 };
    }
    acc[invoice.status].amount += invoice.totalAmount;
    acc[invoice.status].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  const revenueByStatus = Object.entries(statusGroups).map(
    ([status, data]) => ({
      status,
      amount: data.amount,
      count: data.count,
    })
  );

  // Average invoice value
  const averageInvoiceValue =
    invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) /
        invoices.length
      : 0;

  // Year over year growth
  const currentYearRevenue = invoices
    .filter(
      (invoice) =>
        invoice.date >= subMonths(now, 12) && invoice.status === "paid"
    )
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  const previousYearRevenue = invoices
    .filter(
      (invoice) =>
        invoice.date >= subMonths(now, 24) &&
        invoice.date < subMonths(now, 12) &&
        invoice.status === "paid"
    )
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  const yearOverYearGrowth =
    previousYearRevenue > 0
      ? ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100
      : 0;

  // Monthly revenue trend with paid and unpaid breakdown for the filtered period
  const monthlyRevenueTrend = [];
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(referenceDate, i));
    const monthEnd = endOfMonth(subMonths(referenceDate, i));

    const monthInvoices = invoices.filter(
      (invoice) => invoice.date >= monthStart && invoice.date <= monthEnd
    );

    const paidRevenue = monthInvoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const unpaidRevenue = monthInvoices
      .filter((invoice) => invoice.status !== "paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);

    monthlyRevenueTrend.push({
      month: format(monthStart, "MMM yyyy"),
      paid: paidRevenue,
      unpaid: unpaidRevenue,
      total: paidRevenue + unpaidRevenue,
    });
  }

  return {
    totalRevenue,
    monthlyRevenue,
    monthlyRevenueTrend,
    revenueByStatus,
    averageInvoiceValue,
    yearOverYearGrowth,
  };
}

export async function getTimeTrackingAnalytics(
  teamId: string,
  contractorId?: string,
  dateFilter?: DateFilter
): Promise<TimeTrackingAnalytics> {
  const now = new Date();
  const filterStartDate = dateFilter?.startDate;
  const filterEndDate = dateFilter?.endDate;

  // Get time tracking data with project information, optionally filtered by contractor (via invoice) and date
  const timeEntries = await prisma.timeTrackingItem.findMany({
    where: {
      project: {
        teamId,
      },
      ...(contractorId && {
        invoiceItem: {
          invoice: {
            companies: {
              some: {
                id: contractorId,
                types: { some: { name: "contractor" } },
              },
            },
          },
        },
      }),
      ...(filterStartDate &&
        filterEndDate && {
          date: {
            gte: filterStartDate,
            lte: filterEndDate,
          },
        }),
    },
    include: {
      project: true,
      invoiceItem: {
        include: {
          invoice: true,
        },
      },
    },
  });

  const totalHours = timeEntries.reduce(
    (sum, entry) => sum + (entry.shadowHours ?? 0),
    0
  );

  // Hours by project with revenue (tracking both shadow and billed hours)
  const projectGroups = timeEntries.reduce((acc, entry) => {
    const projectName = entry.project.name;
    const projectColor = entry.project.color;
    if (!acc[projectName]) {
      acc[projectName] = {
        shadowHours: 0,
        billedHours: 0,
        revenue: 0,
        color: projectColor,
      };
    }
    acc[projectName].shadowHours += entry.shadowHours ?? entry.hours;
    acc[projectName].billedHours += entry.hours;

    acc[projectName].revenue += entry.hours * entry.hourlyRate;

    return acc;
  }, {} as Record<string, { shadowHours: number; billedHours: number; revenue: number; color: string }>);

  const hoursByProject = Object.entries(projectGroups).map(
    ([projectName, data]) => ({
      projectName,
      projectColor: data.color,
      shadowHours: data.shadowHours,
      billedHours: data.billedHours,
      revenue: data.revenue,
    })
  );

  // Hours by month (tracking both shadow and billed hours)
  const hoursByMonth = [];
  const monthsToShow =
    filterStartDate && filterEndDate
      ? getMonthsBetween(filterStartDate, filterEndDate)
      : 6;
  const referenceDate = filterEndDate || now;

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(referenceDate, i));
    const monthEnd = endOfMonth(subMonths(referenceDate, i));

    const monthEntries = timeEntries.filter(
      (entry) => entry.date >= monthStart && entry.date <= monthEnd
    );

    const shadowHours = monthEntries.reduce(
      (sum, entry) => sum + (entry.shadowHours ?? entry.hours),
      0
    );
    const billedHours = monthEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );

    hoursByMonth.push({
      month: format(monthStart, "MMM yyyy"),
      shadowHours,
      billedHours,
    });
  }

  // Average hourly rate (using shadowHours only)
  const totalRevenue = timeEntries.reduce(
    (sum, entry) => sum + (entry.shadowHours ?? 0) * entry.hourlyRate,
    0
  );
  const averageHourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;

  return {
    totalHours,
    hoursByProject,
    hoursByMonth,
    averageHourlyRate,
  };
}
