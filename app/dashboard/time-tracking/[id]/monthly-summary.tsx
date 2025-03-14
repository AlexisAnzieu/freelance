"use client";

import { TimeTracking } from "@prisma/client";

interface TimeTrackingWithItems extends TimeTracking {
  items: {
    id: string;
    date: Date;
    description: string;
    hours: number;
    hourlyRate: number;
  }[];
}

export default function MonthlySummary({
  timeTrackingList,
}: {
  timeTrackingList: TimeTrackingWithItems[];
}) {
  const monthlySummaries = timeTrackingList
    .map((tracking) => {
      const totalHours = tracking.items.reduce(
        (sum, item) => sum + item.hours,
        0
      );
      const totalAmount = tracking.items.reduce(
        (sum, item) => sum + item.hours * item.hourlyRate,
        0
      );
      return {
        month: new Date(tracking.month),
        totalHours,
        totalAmount,
        entries: tracking.items.length,
      };
    })
    .sort((a, b) => b.month.getTime() - a.month.getTime());

  if (monthlySummaries.length === 0) {
    return null;
  }

  const maxHours = Math.max(...monthlySummaries.map((s) => s.totalHours));

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Monthly Activity
        </h3>
        <div className="mt-6 space-y-8">
          {monthlySummaries.map((summary) => {
            const percentageOfMax = (summary.totalHours / maxHours) * 100;
            return (
              <div key={summary.month.toISOString()}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {summary.month.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {summary.entries} entries
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${summary.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${percentageOfMax}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {summary.totalHours} hours
                    </div>
                    <div className="text-gray-500">
                      {summary.entries > 0
                        ? `$${(
                            summary.totalAmount / summary.totalHours
                          ).toFixed(2)}/hr avg.`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
