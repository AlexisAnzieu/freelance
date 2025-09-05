import prisma from "@/app/lib/prisma";
import Link from "next/link";
import Search from "./search";
import { Pagination } from "@/app/dashboard/invoices/pagination";
import { auth } from "@/auth";
import { InvoicesTable } from "./invoices-table";
import { connection } from "next/server";
const ITEMS_PER_PAGE = 10;

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  await connection();

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        AND: [
          { teamId: session.teamId },
          {
            OR: [{ name: { contains: query } }],
          },
        ],
      },
      include: {
        companies: {
          include: {
            types: true,
          },
        },
        items: true,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.invoice.count({
      where: {
        AND: [
          { teamId: session.teamId },
          {
            OR: [{ name: { contains: query } }],
          },
        ],
      },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices including their ID, customer, amount, and
            status.
          </p>
        </div>
        <div className="mt-4 sm:flex sm:items-center sm:space-x-4">
          <Search />
          <div className="mt-4 sm:mt-0">
            <Link
              href="/dashboard/invoices/create"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Invoice
            </Link>
          </div>
        </div>
      </div>
      <InvoicesTable invoices={invoices} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        searchParams={searchParams ?? {}}
      />
    </div>
  );
}
