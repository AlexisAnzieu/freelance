"use client";

import Link from "next/link";
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
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out font-semibold"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {invoice.name || "-"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {filterCompaniesByType(
                        invoice.companies,
                        COMPANY_TYPES.CUSTOMER
                      ).map((company) => company.companyName)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                      {CURRENCIES[invoice.currency as keyof typeof CURRENCIES]
                        ?.symbol || "$"}
                      {invoice.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
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
                          className={`block w-28 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors duration-150 ease-in-out cursor-pointer ${
                            {
                              draft:
                                "bg-gray-50 text-gray-600 ring-gray-500/10",
                              sent: "bg-blue-50 text-blue-700 ring-blue-700/10",
                              paid: "bg-green-50 text-green-700 ring-green-600/10",
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {format(invoice.date, "MMM d, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {invoice.status === "paid"
                        ? ""
                        : formatDistanceToNow(invoice.dueDate, {
                            addSuffix: true,
                          })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={async () => {
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
                            alert("Failed to generate PDF. Please try again.");
                          } finally {
                            setLoadingPdf(null);
                          }
                        }}
                        disabled={loadingPdf === invoice.id}
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        {loadingPdf === invoice.id
                          ? "Generating..."
                          : "Download PDF"}
                      </button>
                      <form action={deleteInvoiceAction}>
                        <input
                          type="hidden"
                          name="invoiceId"
                          value={invoice.id}
                        />
                        <DeleteButton itemName="invoice" />
                      </form>
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
