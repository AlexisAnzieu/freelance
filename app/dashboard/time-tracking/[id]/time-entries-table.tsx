"use client";

import { Invoice, InvoiceItem, TimeTrackingItem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deleteTimeEntry, generateInvoice } from "./actions";
import { formatDate } from "@/app/lib/utils";
import { useState } from "react";
import SidePanel from "@/app/ui/side-panel";
import TimeEntryForm from "../../../dashboard/time-tracking/create/time-entry-form";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<TimeEntryWithInvoice | null>(null);

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
    <div className="mt-6 space-y-8">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {timeEntries.reduce((sum, entry) => sum + entry.hours, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            $
            {timeEntries
              .reduce((sum, entry) => sum + entry.hours * entry.hourlyRate, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Pending Entries</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {timeEntries.filter((entry) => !entry.invoiceItemId).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Time Entries</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                setSelectedEntry(null);
                setIsDrawerOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              New Entry
            </button>
            <div className="relative group">
              <button
                onClick={handleGenerateInvoice}
                disabled={selectedEntries.size === 0}
                className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  selectedEntries.size === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                Generate Invoice
              </button>
              {selectedEntries.size === 0 && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg animate-fade-in">
                  You need to select time entries to generate an invoice
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                        {entry.invoiceItem.invoice.number} -{" "}
                        {entry.invoiceItem.invoice.name}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not Invoiced</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          setIsDrawerOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SidePanel
        title={selectedEntry ? "Edit Time Entry" : "New Time Entry"}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEntry(null);
        }}
      >
        <div className="px-6">
          <TimeEntryForm
            projectId={timeEntries[0]?.projectId ?? ""}
            initialData={
              selectedEntry
                ? {
                    id: selectedEntry.id,
                    date: selectedEntry.date,
                    description: selectedEntry.description,
                    hours: selectedEntry.hours,
                    hourlyRate: selectedEntry.hourlyRate,
                  }
                : undefined
            }
            onSuccess={() => {
              setIsDrawerOpen(false);
              setSelectedEntry(null);
              router.refresh();
            }}
          />
        </div>
      </SidePanel>
    </div>
  );
}
