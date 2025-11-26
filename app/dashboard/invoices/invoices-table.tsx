"use client";

import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { Invoice } from "@prisma/client";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CompanyWithTypes, filterCompaniesByType } from "@/app/lib/db";
import {
  deleteInvoiceAction,
  updateInvoiceStatus,
  InvoiceStatus,
} from "./actions";
import { DeleteButton } from "@/app/ui/delete-button";
import { InvoicePDF } from "./[id]/invoice-pdf";
import { COMPANY_TYPES, CURRENCIES } from "@/app/lib/constants";
interface InvoicesTableProps {
  invoices: (Invoice & {
    companies: CompanyWithTypes[];
    items: {
      id: string;
      name: string;
      unitaryPrice: number;
      quantity: number;
    }[];
  })[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const router = useRouter();
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);

  async function updateStatus(formData: FormData) {
    const id = formData.get("invoiceId") as string;
    const status = formData.get("status") as InvoiceStatus;

    try {
      await updateInvoiceStatus(id, status);
    } catch (error) {
      console.error("Failed to update invoice status:", error);
    }
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md border border-[#e8e8e8]">
            <table className="min-w-full divide-y divide-[#e8e8e8]">
              <thead>
                <tr className="bg-[#f7f7f5]">
                  <th
                    scope="col"
                    className="py-2.5 pl-4 pr-3 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Contractor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium text-[#787774] uppercase tracking-wider"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8] bg-white">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() =>
                      router.push(`/dashboard/invoices/${invoice.id}`)
                    }
                    className="hover:bg-[#f7f7f5] transition-colors duration-75 cursor-pointer group"
                  >
                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-[#37352f]">
                      {invoice.number}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#37352f]">
                      {invoice.name || "-"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#787774]">
                      {filterCompaniesByType(
                        invoice.companies,
                        COMPANY_TYPES.CUSTOMER
                      ).map((company) => company.companyName)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#787774]">
                      {filterCompaniesByType(
                        invoice.companies,
                        COMPANY_TYPES.CONTRACTOR
                      ).map((company) => company.companyName)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#37352f] font-medium">
                      {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                        ?.symbol || "$"}
                      {invoice.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <form action={updateStatus} className="min-w-0">
                        <input
                          type="hidden"
                          name="invoiceId"
                          value={invoice.id}
                        />
                        <select
                          name="status"
                          value={invoice.status}
                          aria-label="Invoice status"
                          className={`block w-24 rounded px-2 py-1 text-xs font-medium border transition-colors duration-100 cursor-pointer focus:outline-none focus:ring-1 ${
                            {
                              draft:
                                "bg-[#f1f1f0] text-[#787774] border-[#e8e8e8] focus:ring-[#9b9a97]",
                              sent: "bg-[#e8f4fd] text-[#2eaadc] border-[#d3ebf9] focus:ring-[#2eaadc]",
                              paid: "bg-[#e8f5ee] text-[#00a67d] border-[#d3ede1] focus:ring-[#00a67d]",
                            }[invoice.status]
                          }`}
                          onChange={async (e) => {
                            const form = e.currentTarget.form;
                            if (!form) return;
                            const formData = new FormData(form);
                            await updateStatus(formData);
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                        </select>
                      </form>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#787774]">
                      {format(invoice.date, "MMM d, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-[#787774]">
                      {invoice.status === "paid"
                        ? ""
                        : formatDistanceToNow(invoice.dueDate, {
                            addSuffix: true,
                          })}
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-3 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setLoadingPdf(invoice.id);
                              const blob = await pdf(
                                <InvoicePDF invoice={invoice} />
                              ).toBlob();
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `invoice-${invoice.number}.pdf`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Failed to generate PDF:", error);
                              alert(
                                "Failed to generate PDF. Please try again."
                              );
                            } finally {
                              setLoadingPdf(null);
                            }
                          }}
                          disabled={loadingPdf === invoice.id}
                          className="inline-flex items-center justify-center w-7 h-7 rounded text-[#787774] hover:text-[#37352f] hover:bg-[#e8e8e8] transition-colors duration-100 disabled:opacity-50"
                          title="Download PDF"
                        >
                          {loadingPdf === invoice.id ? (
                            <svg
                              className="w-4 h-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                          )}
                        </button>
                        <form
                          action={deleteInvoiceAction}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="hidden"
                            name="invoiceId"
                            value={invoice.id}
                          />
                          <DeleteButton itemName="invoice" />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
