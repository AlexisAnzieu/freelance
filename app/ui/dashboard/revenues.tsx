import prisma from "@/app/lib/prisma";
import { Invoice } from "@prisma/client";
import { auth } from "@/auth";
import {
  BanknotesIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

async function getInvoiceStats() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      teamId: session.teamId,
    },
  });

  const totalRevenue = invoices
    .filter((invoice: Invoice) => invoice.status === "paid")
    .reduce((sum: number, invoice: Invoice) => sum + invoice.totalAmount, 0);

  const paidInvoices = invoices.filter(
    (invoice: Invoice) => invoice.status === "paid"
  ).length;
  const unpaidInvoices = invoices.filter(
    (invoice: Invoice) => invoice.status !== "paid"
  ).length;

  return {
    totalRevenue,
    paidInvoices,
    unpaidInvoices,
    totalInvoices: invoices.length,
  };
}

export default async function RevenuesCard() {
  const stats = await getInvoiceStats();

  return (
    <div className="rounded-xl bg-gradient-to-b from-white to-gray-50/50 p-6 shadow-sm ring-1 ring-gray-900/5">
      <h2 className="text-lg font-semibold leading-7 text-gray-900 flex items-center gap-2">
        <BanknotesIcon className="h-5 w-5 text-blue-600" />
        Revenue Overview
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-emerald-600" />
            Total Revenue
          </dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600">
            ${stats.totalRevenue.toLocaleString()}
          </dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            Total Invoices
          </dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-blue-600">
            {stats.totalInvoices}
          </dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2">
            <CheckBadgeIcon className="h-5 w-5 text-green-600" />
            Paid Invoices
          </dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-green-600">
            {stats.paidInvoices}
          </dd>
        </div>
        <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-orange-600" />
            Unpaid Invoices
          </dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-orange-600">
            {stats.unpaidInvoices}
          </dd>
        </div>
      </div>
    </div>
  );
}
