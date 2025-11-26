import { Metadata } from "next";
import { createCustomer } from "./actions";
import { CompanyForm } from "@/app/ui/companies/company-form";

export const metadata: Metadata = {
  title: "Create Customer",
};

export default function Page() {
  return (
    <main>
      <h1 className="mb-6 text-xl font-semibold text-[#37352f]">
        Create Customer
      </h1>
      <CompanyForm title="Customer" onSubmit={createCustomer} />
    </main>
  );
}
