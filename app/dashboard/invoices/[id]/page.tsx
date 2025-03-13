import { notFound } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { PDFSection } from "./pdf-section";
import { auth } from "@/auth";
import { filterCompaniesByType } from "@/app/lib/db";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      AND: [{ id }, { teamId: session.teamId }],
    },
    include: {
      items: true,
      companies: {
        include: {
          types: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const statusStyles = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  };

  const contractors = filterCompaniesByType(invoice.companies, "contractor");
  const customers = filterCompaniesByType(invoice.companies, "customer");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl">
      <div className="space-y-8 bg-white p-10 rounded-lg shadow">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Invoice #{invoice.number}
          </h1>
        </div>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Customer</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customers[0]?.companyName || "N/A"}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Contractor</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {contractors[0]?.companyName || "N/A"}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  statusStyles[invoice.status as keyof typeof statusStyles]
                }`}
              >
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
            <dd className="mt-1 text-sm text-gray-900">
              $
              {invoice.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Tax</dt>
            <dd className="mt-1 text-sm text-gray-900">
              $
              {invoice.tax.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm text-gray-900">
              $
              {invoice.totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDistanceToNow(invoice.date, { addSuffix: true })}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDistanceToNow(invoice.dueDate, { addSuffix: true })}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDistanceToNow(invoice.updatedAt, { addSuffix: true })}
            </dd>
          </div>
        </dl>
      </div>

      <PDFSection invoice={invoice} />
    </div>
  );
}
