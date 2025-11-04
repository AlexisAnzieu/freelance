import { CompanyEditPage } from "@/app/dashboard/_components/company-edit-page";
import { editCustomerAction } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <CompanyEditPage
      id={id}
      type="customer"
      title="Customer"
      idFieldName="customerId"
      editAction={editCustomerAction}
    />
  );
}
