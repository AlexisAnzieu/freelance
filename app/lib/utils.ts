import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface TimeEntry {
  hours: number;
  hourlyRate: number;
  invoiceItemId: string | null;
  invoiceItem?: {
    invoice?: {
      status: string;
    } | null;
  } | null;
}

export interface CostBreakdown {
  notInvoiced: number;
  invoicedUnpaid: number;
  paid: number;
}

export function calculateCostBreakdown(
  timeEntries: TimeEntry[]
): CostBreakdown {
  return timeEntries.reduce(
    (acc, entry) => {
      const entryHours = entry.hours || 0;
      const entryHourlyRate = entry.hourlyRate || 0;
      const entryCost = entryHours * entryHourlyRate;

      if (!entry.invoiceItemId) {
        acc.notInvoiced += entryCost;
        return acc;
      }

      const invoiceStatus = entry.invoiceItem?.invoice?.status;

      if (invoiceStatus === "paid") {
        acc.paid += entryCost;
      } else {
        acc.invoicedUnpaid += entryCost;
      }

      return acc;
    },
    {
      notInvoiced: 0,
      invoicedUnpaid: 0,
      paid: 0,
    }
  );
}

export function formatCurrencyAmount(amount: number, currency: string): string {
  if (!Number.isFinite(amount)) {
    return "0";
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Failed to format currency", { amount, currency, error });
    return amount.toFixed(2);
  }
}
