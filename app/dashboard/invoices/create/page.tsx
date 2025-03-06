import prisma from "@/app/lib/prisma";
import { Form } from "./create-form";

export default async function Page() {
  const customers = await prisma.customer.findMany({
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
