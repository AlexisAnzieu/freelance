import prisma from "@/app/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

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
  hoursByProject: { projectName: string; hours: number; revenue: number }[];
  hoursByMonth: { month: string; hours: number }[];
  averageHourlyRate: number;
  utilizationRate: number;
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
  contractorId?: string
): Promise<RevenueAnalytics> {
  const now = new Date();

  // Get all invoices for the team, optionally filtered by contractor
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
    },
    orderBy: { date: "asc" },
  });

  // Calculate total revenue from paid invoices
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  // Monthly revenue for the last 6 months
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

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

  // Monthly revenue trend with paid and unpaid breakdown for the last 6 months
  const monthlyRevenueTrend = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

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
  contractorId?: string
): Promise<TimeTrackingAnalytics> {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  // Get time tracking data with project information, optionally filtered by contractor
  const timeEntries = await prisma.timeTrackingItem.findMany({
    where: {
      project: {
        teamId,
        ...(contractorId && {
          companies: {
            some: {
              id: contractorId,
              types: { some: { name: "contractor" } },
            },
          },
        }),
      },
      date: { gte: sixMonthsAgo },
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

  // Hours by project with revenue (using shadowHours only)
  const projectGroups = timeEntries.reduce((acc, entry) => {
    const projectName = entry.project.name;
    if (!acc[projectName]) {
      acc[projectName] = { hours: 0, revenue: 0 };
    }
    acc[projectName].hours += entry.shadowHours ?? 0;

    // Add revenue if this time entry is invoiced
    if (entry.invoiceItem?.invoice?.status === "paid") {
      acc[projectName].revenue += (entry.shadowHours ?? 0) * entry.hourlyRate;
    }

    return acc;
  }, {} as Record<string, { hours: number; revenue: number }>);

  const hoursByProject = Object.entries(projectGroups).map(
    ([projectName, data]) => ({
      projectName,
      hours: data.hours,
      revenue: data.revenue,
    })
  );

  // Hours by month (using shadowHours only)
  const hoursByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const monthHours = timeEntries
      .filter((entry) => entry.date >= monthStart && entry.date <= monthEnd)
      .reduce((sum, entry) => sum + (entry.shadowHours ?? 0), 0);

    hoursByMonth.push({
      month: format(monthStart, "MMM yyyy"),
      hours: monthHours,
    });
  }

  // Average hourly rate (using shadowHours only)
  const totalRevenue = timeEntries.reduce(
    (sum, entry) => sum + (entry.shadowHours ?? 0) * entry.hourlyRate,
    0
  );
  const averageHourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;

  // Utilization rate (assuming 40 hours per week as target)
  const weeksInPeriod = 26; // 6 months
  const targetHours = weeksInPeriod * 40;
  const utilizationRate = (totalHours / targetHours) * 100;

  return {
    totalHours,
    hoursByProject,
    hoursByMonth,
    averageHourlyRate,
    utilizationRate,
  };
}

export async function getProjectAnalytics(
  teamId: string
): Promise<ProjectAnalytics> {
  const projects = await prisma.project.findMany({
    where: { teamId },
    include: {
      timeEntries: {
        include: {
          invoiceItem: {
            include: {
              invoice: true,
            },
          },
        },
      },
      companies: true,
    },
  });

  // Project profitability
  const projectProfitability = projects.map((project) => {
    const totalHours = project.timeEntries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    const revenue = project.timeEntries
      .filter((entry) => entry.invoiceItem?.invoice?.status === "paid")
      .reduce((sum, entry) => sum + entry.hours * entry.hourlyRate, 0);

    // Simple profit calculation (revenue - cost, assuming hourly rate covers all costs)
    const profit = revenue;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      projectName: project.name,
      revenue,
      hours: totalHours,
      profit,
      profitMargin,
    };
  });

  // Projects by company
  const companyGroups = projects.reduce((acc, project) => {
    project.companies.forEach((company) => {
      if (!acc[company.companyName]) {
        acc[company.companyName] = { projectCount: 0, revenue: 0 };
      }
      acc[company.companyName].projectCount += 1;

      const projectRevenue = project.timeEntries
        .filter((entry) => entry.invoiceItem?.invoice?.status === "paid")
        .reduce((sum, entry) => sum + entry.hours * entry.hourlyRate, 0);

      acc[company.companyName].revenue += projectRevenue;
    });
    return acc;
  }, {} as Record<string, { projectCount: number; revenue: number }>);

  const projectsByCompany = Object.entries(companyGroups).map(
    ([companyName, data]) => ({
      companyName,
      projectCount: data.projectCount,
      revenue: data.revenue,
    })
  );

  return {
    projectProfitability,
    projectsByCompany,
  };
}
