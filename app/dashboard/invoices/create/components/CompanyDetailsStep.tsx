import { CompanyWithTypes } from "@/app/lib/db";
import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";

interface CompanyDetailsStepProps {
  customerId: string;
  contractorId: string;
  customers: CompanyWithTypes[];
  contractors: CompanyWithTypes[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors?: ValidationErrors;
}

export function CompanyDetailsStep({
  customerId,
  contractorId,
  customers,
  contractors,
  onChange,
  errors,
}: CompanyDetailsStepProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-[#0F172A] mb-6">
        Company Selection
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-700 mb-2"
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
              "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              errors?.customerId &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
            <p className="mt-1 text-sm text-red-500">{errors.customerId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contractorId"
            className="block text-sm font-medium text-gray-700 mb-2"
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
              "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              errors?.contractorId &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20"
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
            <p className="mt-1 text-sm text-red-500">{errors.contractorId}</p>
          )}
        </div>
      </div>
    </div>
  );
}
