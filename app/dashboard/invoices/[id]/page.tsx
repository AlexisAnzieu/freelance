import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/prisma";
import { PDFSection } from "./pdf-section";
import { auth } from "@/auth";

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

  return (
    <div className="mx-auto max-w-2xl px-4  sm:px-6  lg:max-w-7xl">
      <div className="mb-8">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          ← Return to invoices
        </Link>
      </div>
      <PDFSection invoice={invoice} />
    </div>
  );
}
