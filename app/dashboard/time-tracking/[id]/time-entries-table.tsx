"use client";

import { Invoice, InvoiceItem, TimeTrackingItem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deleteTimeEntry, generateInvoice } from "./actions";
import { formatDate } from "@/app/lib/utils";
import { useState } from "react";
import SidePanel from "@/app/ui/side-panel";
import TimeEntryForm from "../../../dashboard/time-tracking/create/time-entry-form";
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { CURRENCIES } from "@/app/lib/constants";
import LoadingButton from "@/app/ui/loading-button";

type TimeEntryWithInvoice = TimeTrackingItem & {
  invoiceItem?:
    | (InvoiceItem & {
        invoice: Invoice;
      })
    | null;
};

interface Props {
  timeEntries: TimeEntryWithInvoice[];
  projectCurrency: string;
  projectId: string;
}

export default function TimeEntriesTable({
  timeEntries,
  projectCurrency,
  projectId,
}: Props) {
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
  const [selectionAnchor, setSelectionAnchor] = useState<number | null>(null);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const handleSelect = (
    id: string,
    index: number,
    isShiftPressed: boolean,
    shouldSelect: boolean
  ) => {
    setSelectedEntries((prev) => {
      const newSet = new Set(prev);

      if (isShiftPressed && selectionAnchor !== null) {
        const start = Math.min(selectionAnchor, index);
        const end = Math.max(selectionAnchor, index);

        for (let i = start; i <= end; i++) {
          const entryInRange = sortedEntries[i];
          if (entryInRange.invoiceItemId) {
            continue; // Skip non-selectable entries
          }

          if (shouldSelect) {
            newSet.add(entryInRange.id);
          } else {
            newSet.delete(entryInRange.id);
          }
        }
      } else {
        if (shouldSelect) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
      }

      return newSet;
    });

    setSelectionAnchor((prev) => {
      if (isShiftPressed && prev !== null) {
        return prev;
      }
      return index;
    });
  };

  const handleGenerateInvoice = async () => {
    if (selectedEntries.size === 0 || isGeneratingInvoice) {
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      await generateInvoice(Array.from(selectedEntries));
      router.refresh();
    } catch (error) {
      console.error("Failed to generate invoice:", error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-md p-5 border border-[#e8e8e8]">
          <h3 className="text-sm font-medium text-[#9b9a97]">Total Hours</h3>
          <p className="mt-2 text-2xl font-semibold text-[#37352f]">
            {timeEntries.reduce((sum, entry) => sum + entry.hours, 0)}
          </p>
        </div>
        <div className="bg-white rounded-md p-5 border border-[#e8e8e8]">
          <h3 className="text-sm font-medium text-[#9b9a97]">Total Amount</h3>
          <p className="mt-2 text-2xl font-semibold text-[#37352f]">
            {CURRENCIES[projectCurrency as keyof typeof CURRENCIES]?.symbol ||
              "$"}
            {timeEntries
              .reduce((sum, entry) => sum + entry.hours * entry.hourlyRate, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-md p-5 border border-[#e8e8e8]">
          <h3 className="text-sm font-medium text-[#9b9a97]">
            Pending Entries
          </h3>
          <p className="mt-2 text-2xl font-semibold text-[#37352f]">
            {timeEntries.filter((entry) => !entry.invoiceItemId).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-[#e8e8e8]">
        <div className="p-4 flex justify-between items-center border-b border-[#e8e8e8]">
          <h2 className="text-base font-medium text-[#37352f]">Time Entries</h2>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => {
                setSelectedEntry(null);
                setIsDrawerOpen(true);
              }}
              className="px-3 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1a73d4] text-white text-sm font-medium transition-colors"
            >
              New Entry
            </button>
            <div className="relative group">
              <LoadingButton
                onClick={handleGenerateInvoice}
                disabled={selectedEntries.size === 0}
                loading={isGeneratingInvoice}
                loadingText="Generating..."
                className={`${
                  selectedEntries.size === 0
                    ? "bg-[#f1f1f0] text-[#9b9a97] cursor-not-allowed"
                    : "bg-[#2383e2] hover:bg-[#1a73d4] text-white"
                }`}
              >
                Generate Invoice
              </LoadingButton>
              {selectedEntries.size === 0 && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-[#37352f] text-white text-xs rounded-md animate-fade-in">
                  You need to select time entries to generate an invoice
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-visible">
          <table className="min-w-full table-fixed">
            <thead className="bg-[#f7f6f3]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-12">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-32">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-auto">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-20">
                  Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-24">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-24">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-48">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#9b9a97] uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e8e8e8]">
              {sortedEntries.map((entry, index) => {
                const isSelected = selectedEntries.has(entry.id);

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isSelected ? "bg-[#e8f4fd]" : ""
                    } hover:bg-[#f7f6f3]`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.invoiceItemId ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-600"
                          aria-label="Invoiced"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedEntries.has(entry.id)}
                          onChange={(event) =>
                            handleSelect(
                              entry.id,
                              index,
                              event.nativeEvent instanceof MouseEvent &&
                                event.nativeEvent.shiftKey,
                              event.currentTarget.checked
                            )
                          }
                          className="h-4 w-4 text-[#2383e2] focus:ring-[#2383e2] border-[#e8e8e8] rounded"
                          aria-label={`Select time entry for ${entry.description}`}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#5f5e5b]">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#37352f] max-w-xs relative group">
                      <div className="truncate">{entry.description}</div>
                      {entry.description && entry.description.length > 50 && (
                        <div className="absolute z-50 invisible group-hover:visible bg-[#37352f] text-white text-xs rounded-md p-2.5 max-w-sm whitespace-normal break-words left-0 top-full mt-1">
                          {entry.description}
                          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-[#37352f]"></div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#5f5e5b]">
                      {entry.hours}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#5f5e5b]">
                      {CURRENCIES[projectCurrency as keyof typeof CURRENCIES]
                        ?.symbol || "$"}
                      {entry.hourlyRate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#5f5e5b]">
                      {CURRENCIES[projectCurrency as keyof typeof CURRENCIES]
                        ?.symbol || "$"}
                      {(entry.hours * entry.hourlyRate).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {entry.invoiceItem?.invoice ? (
                        <a
                          href={`/dashboard/invoices/${entry.invoiceItem.invoice.id}`}
                          className="text-[#2383e2] hover:underline"
                        >
                          {entry.invoiceItem.invoice.number} -{" "}
                          {entry.invoiceItem.invoice.name}
                        </a>
                      ) : (
                        <span className="text-[#9b9a97]">Not Invoiced</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {!entry.invoiceItem?.invoice && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedEntry(entry);
                                setIsDrawerOpen(true);
                              }}
                              className="text-[#9b9a97] hover:text-[#2383e2] p-1 rounded-md hover:bg-[#ebebea] transition-colors"
                              aria-label="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-[#9b9a97] hover:text-red-600 p-1 rounded-md hover:bg-[#ebebea] transition-colors"
                              aria-label="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        <div className="px-4">
          <TimeEntryForm
            key={selectedEntry?.id || "new-entry"}
            projectId={projectId}
            projectCurrency={projectCurrency}
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
