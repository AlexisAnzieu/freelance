import { CompanyWithTypes } from "@/app/lib/db";
import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";

interface CompanyDetailsStepProps {
  customerId: string;
  contractorId: string;
  selectedPaymentMethod?: string;
  customers: CompanyWithTypes[];
  contractors: CompanyWithTypes[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors?: ValidationErrors;
}

export function CompanyDetailsStep({
  customerId,
  contractorId,
  selectedPaymentMethod,
  customers,
  contractors,
  onChange,
  errors,
}: CompanyDetailsStepProps) {
  const selectedContractor = contractors.find((c) => c.id === contractorId);
  let paymentMethods: string[] = [];

  if (selectedContractor?.paymentMethods) {
    try {
      paymentMethods = JSON.parse(selectedContractor.paymentMethods);
    } catch {
      paymentMethods = [];
    }
  }
  return (
    <div className="rounded-md bg-white p-5 border border-[#e8e8e8]">
      <h2 className="text-base font-medium text-[#37352f] mb-5">
        Company Selection
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="contractorId"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Contractor
          </label>
          <select
            id="contractorId"
            name="contractorId"
            required
            value={contractorId}
            onChange={onChange}
            className={cn(
              "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
              errors?.contractorId &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <option value="">Select a contractor</option>
            {contractors.map((company) => (
              <option key={company.id} value={company.id}>
                {company.companyName}
              </option>
            ))}
          </select>
          {errors?.contractorId && (
            <p className="mt-1 text-sm text-red-600">{errors.contractorId}</p>
          )}

          {contractorId && paymentMethods.length > 0 && (
            <div className="mt-4">
              <label
                htmlFor="selectedPaymentMethod"
                className="block text-sm font-medium text-[#37352f] mb-1.5"
              >
                Payment Method
              </label>
              <select
                id="selectedPaymentMethod"
                name="selectedPaymentMethod"
                required
                value={selectedPaymentMethod}
                onChange={onChange}
                className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]"
              >
                <option value="">Select a payment method</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method.length > 50 ? method.slice(0, 47) + "..." : method}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            required
            value={customerId}
            onChange={onChange}
            className={cn(
              "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
              errors?.customerId &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <option value="">Select a customer</option>
            {customers.map((company) => (
              <option key={company.id} value={company.id}>
                {company.companyName}
              </option>
            ))}
          </select>
          {errors?.customerId && (
            <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
          )}
        </div>
      </div>
    </div>
  );
}
