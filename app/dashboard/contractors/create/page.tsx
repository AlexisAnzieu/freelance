import { Metadata } from "next";
import { createContractor } from "./actions";
import { CompanyForm } from "@/app/ui/companies/company-form";

export const metadata: Metadata = {
  title: "Create Contractor",
};

export default function Page() {
  return (
    <main>
      <h1 className="mb-8 text-xl md:text-2xl">Create Contractor</h1>
      <CompanyForm title="Contractor" onSubmit={createContractor} />
    </main>
  );
}
