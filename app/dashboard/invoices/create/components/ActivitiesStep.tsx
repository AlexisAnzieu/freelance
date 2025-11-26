import { InvoiceActivityItem } from "./InvoiceActivityItem";
import { InvoiceSummary } from "./InvoiceSummary";
import { ValidationErrors } from "../utils/format-errors";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitaryPrice: number;
  timeEntryId?: string;
}

interface ActivitiesStepProps {
  items: InvoiceItem[];
  tax: number;
  onItemChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => void;
  onTaxChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddActivity: () => void;
  errors?: ValidationErrors;
}

export function ActivitiesStep({
  items,
  tax,
  onItemChange,
  onTaxChange,
  onAddActivity,
  errors,
}: ActivitiesStepProps) {
  return (
    <div className="rounded-md bg-white p-5 border border-[#e8e8e8]">
      <h2 className="text-base font-medium text-[#37352f] mb-5">Activities</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <InvoiceActivityItem
            key={item.id}
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            unitaryPrice={item.unitaryPrice}
            onChange={onItemChange}
            errors={errors}
          />
        ))}

        <button
          type="button"
          onClick={onAddActivity}
          className="mt-5 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-[#2383e2] hover:bg-[#1a73d4] transition-colors"
        >
          Add Activity
        </button>

        <InvoiceSummary tax={tax} onChange={onTaxChange} errors={errors} />

        {errors?.items && (
          <p className="mt-1 text-sm text-red-600">{errors.items}</p>
        )}
      </div>
    </div>
  );
}
