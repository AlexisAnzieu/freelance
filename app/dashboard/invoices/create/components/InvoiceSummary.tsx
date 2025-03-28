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
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div>
        <label htmlFor="tax" className="block text-sm font-medium mb-2">
          Tax Rate
        </label>
        <select
          id="tax"
          name="tax"
          value={tax}
          onChange={onChange}
          className={cn(
            "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            errors?.tax &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        >
          {TAX_RATES.map(({ name, rate }) => (
            <option key={name} value={rate}>
              {name} ({rate}%)
            </option>
          ))}
        </select>
        {errors?.tax && (
          <p className="mt-1 text-sm text-red-500">{errors.tax}</p>
        )}
      </div>
    </div>
  );
}
