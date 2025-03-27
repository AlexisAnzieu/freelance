"use client";

import { Invoice, InvoiceItem, TimeTrackingItem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deleteTimeEntry, generateInvoice } from "./actions";
import { formatDate } from "@/app/lib/utils";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type TimeEntryWithInvoice = TimeTrackingItem & {
  invoiceItem?:
    | (InvoiceItem & {
        invoice: Invoice;
      })
    | null;
};

interface Props {
  timeEntries: TimeEntryWithInvoice[];
}

export default function TimeEntriesTable({ timeEntries }: Props) {
  const router = useRouter();

  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTimeEntry(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete time entry:", error);
    }
  };

  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(
    new Set()
  );

  const handleSelect = (id: string) => {
    setSelectedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoice(Array.from(selectedEntries));
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Time Entries</h2>
        {selectedEntries.size > 0 && (
          <button
            onClick={handleGenerateInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Generate Invoice
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.invoiceItemId ? (
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-500"
                      aria-label="Invoiced"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedEntries.has(entry.id)}
                      onChange={() => handleSelect(entry.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Select time entry for ${entry.description}`}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(entry.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.hours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${entry.hourlyRate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${(entry.hours * entry.hourlyRate).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {entry.invoiceItem?.invoice ? (
                    <a
                      href={`/dashboard/invoices/${entry.invoiceItem.invoice.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Invoice
                    </a>
                  ) : (
                    <span className="text-gray-500">Not Invoiced</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
