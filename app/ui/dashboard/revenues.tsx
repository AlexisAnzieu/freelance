import prisma from "@/app/lib/prisma";
import { Invoice } from "@prisma/client";
import { auth } from "@/auth";

async function getInvoiceStats() {
  const session = await auth();

  console.log("OOOPS", session);

  if (!session?.user?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      teamId: session.user.teamId,
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
    <div className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Revenue Overview
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Revenue
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            ${stats.totalRevenue.toLocaleString()}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Invoices
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.totalInvoices}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Paid Invoices
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.paidInvoices}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Unpaid Invoices
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.unpaidInvoices}
          </dd>
        </div>
      </div>
    </div>
  );
}
