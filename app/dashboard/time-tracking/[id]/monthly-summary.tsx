import { TimeTrackingItem } from "@prisma/client";

interface Props {
  timeEntries: TimeTrackingItem[];
}

export default function MonthlySummary({ timeEntries }: Props) {
  // Group time entries by month
  const entriesByMonth = timeEntries.reduce<Record<string, TimeTrackingItem[]>>(
    (acc, entry) => {
      const monthKey = new Date(entry.date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(entry);
      return acc;
    },
    {}
  );

  // Calculate monthly summaries
  const monthlySummaries = Object.entries(entriesByMonth).map(
    ([month, entries]) => {
      const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
      const totalAmount = entries.reduce(
        (sum, entry) => sum + entry.hours * entry.hourlyRate,
        0
      );

      return {
        month,
        totalHours,
        totalAmount,
        entriesCount: entries.length,
      };
    }
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monthlySummaries.map(
          ({ month, totalHours, totalAmount, entriesCount }) => (
            <div
              key={month}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{month}</h3>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Total Hours</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {totalHours.toFixed(1)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Amount</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ${totalAmount.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Entries</dt>
                  <dd className="text-lg text-gray-900">{entriesCount}</dd>
                </div>
              </dl>
            </div>
          )
        )}
      </div>
    </div>
  );
}
