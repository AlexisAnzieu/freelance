import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";
import { CURRENCIES } from "@/app/lib/constants";

interface BasicInformationProps {
  name: string;
  date: string;
  dueDate: string;
  currency: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors?: ValidationErrors;
}

export function BasicInformationStep({
  name,
  date,
  dueDate,
  currency,
  onChange,
  errors,
}: BasicInformationProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-[#0F172A] mb-6">
        Invoice Details
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Invoice Name (optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className={cn(
              "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              errors?.name &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={onChange}
            className={cn(
              "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
              errors?.currency &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            )}
          >
            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <option key={code} value={code}>
                {currency.symbol} {code} - {currency.name}
              </option>
            ))}
          </select>
          {errors?.currency && (
            <p className="mt-1 text-sm text-red-500">{errors.currency}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={date}
              onChange={onChange}
              className={cn(
                "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors?.date &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors?.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              required
              value={dueDate}
              onChange={onChange}
              className={cn(
                "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors?.dueDate &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            {errors?.dueDate && (
              <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
