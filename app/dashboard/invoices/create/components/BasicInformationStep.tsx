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
    <div className="rounded-md bg-white p-5 border border-[#e8e8e8]">
      <h2 className="text-base font-medium text-[#37352f] mb-5">
        Invoice Details
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
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
              "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
              errors?.name &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={onChange}
            className={cn(
              "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
              errors?.currency &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <option key={code} value={code}>
                {currency.symbol} {code} - {currency.name}
              </option>
            ))}
          </select>
          {errors?.currency && (
            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
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
                "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
                errors?.date &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors?.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
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
                "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
                errors?.dueDate &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors?.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
