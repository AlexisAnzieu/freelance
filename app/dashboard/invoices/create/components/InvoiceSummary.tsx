import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";

const TAX_RATES = [
  { name: "Quebec (QST + GST)", rate: 14.975 },
  { name: "Canada (GST)", rate: 5 },
  { name: "Ontario (HST)", rate: 13 },
  { name: "European Union (VAT)", rate: 20 },
  { name: "United Kingdom (VAT)", rate: 20 },
  { name: "Japan (Consumption)", rate: 10 },
  { name: "Custom", rate: 0 },
] as const;

export const DEFAULT_TAX_RATE =
  TAX_RATES.find((rate) => rate.name === "Quebec (QST + GST)")?.rate || 0;

interface InvoiceSummaryProps {
  tax: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors?: ValidationErrors;
}

export function InvoiceSummary({ tax, onChange, errors }: InvoiceSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div>
        <label
          htmlFor="tax"
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Tax Rate
        </label>
        <select
          id="tax"
          name="tax"
          value={tax}
          onChange={onChange}
          className={cn(
            "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
            errors?.tax &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        >
          {TAX_RATES.map(({ name, rate }) => (
            <option key={name} value={rate}>
              {name} ({rate}%)
            </option>
          ))}
        </select>
        {errors?.tax && (
          <p className="mt-1 text-sm text-red-600">{errors.tax}</p>
        )}
      </div>
    </div>
  );
}
