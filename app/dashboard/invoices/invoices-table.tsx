"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Invoice } from "@prisma/client";
import {
  deleteInvoiceAction,
  updateInvoiceStatus,
  InvoiceStatus,
} from "./actions";
import { DeleteButton } from "@/app/ui/delete-button";
interface InvoicesTableProps {
  invoices: (Invoice & {
    companies: {
      companyName: string;
    }[];
  })[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
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
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8 uppercase tracking-wider"
                  >
                    Invoice Number
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
                      {invoice.companies.map((company) => company.companyName)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                      $
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
                      {formatDistanceToNow(invoice.date, { addSuffix: true })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {formatDistanceToNow(invoice.dueDate, {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
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
