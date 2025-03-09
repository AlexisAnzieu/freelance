import prisma from "@/app/lib/prisma";
import { Form } from "./create-form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.teamId) {
    throw new Error("Unauthorized: No team access");
  }

  const customers = await prisma.customer.findMany({
    where: {
      teamId: session.teamId,
    },
    orderBy: {
      companyName: "asc",
    },
  });

  return (
    <main>
      <h1 className="mb-8 text-xl md:text-2xl">Create Invoice</h1>
      <Form customers={customers} />
    </main>
  );
}
