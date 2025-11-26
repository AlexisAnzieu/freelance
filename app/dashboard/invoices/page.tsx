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
    <div>
      {/* Notion-style page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#37352f]">Invoices</h1>
            <p className="mt-1 text-sm text-[#787774]">
              A list of all invoices including their ID, customer, amount, and
              status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Search />
            <Link
              href="/dashboard/invoices/create"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2eaadc] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2799c7]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New
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
