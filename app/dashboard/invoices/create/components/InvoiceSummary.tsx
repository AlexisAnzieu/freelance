import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";

interface InvoiceSummaryProps {
  items: Array<{
    quantity: number;
    unitaryPrice: number;
  }>;
  tax: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: ValidationErrors;
}

export function InvoiceSummary({
  items,
  tax,
  onChange,
  errors,
}: InvoiceSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitaryPrice,
    0
  );

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="text-right">
        <p className="text-sm text-gray-500">Subtotal:</p>
        <p className="text-lg font-medium">${subtotal.toFixed(2)}</p>
      </div>
      <div>
        <label htmlFor="tax" className="block text-sm font-medium mb-2">
          Tax Rate (%)
        </label>
        <input
          type="number"
          id="tax"
          name="tax"
          step="0.01"
          min="0"
          value={tax}
          onChange={onChange}
          className={cn(
            "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            errors?.tax &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {errors?.tax && (
          <p className="mt-1 text-sm text-red-500">{errors.tax}</p>
        )}
      </div>
    </div>
  );
}
