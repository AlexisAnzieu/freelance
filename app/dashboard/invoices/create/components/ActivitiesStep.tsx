import { InvoiceActivityItem } from "./InvoiceActivityItem";
import { InvoiceSummary } from "./InvoiceSummary";

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
  onTaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddActivity: () => void;
}

export function ActivitiesStep({
  items,
  tax,
  onItemChange,
  onTaxChange,
  onAddActivity,
}: ActivitiesStepProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Activities</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <InvoiceActivityItem
            key={item.id}
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            unitaryPrice={item.unitaryPrice}
            onChange={onItemChange}
          />
        ))}

        <button
          type="button"
          onClick={onAddActivity}
          className="mt-6 inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 shadow-sm hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Activity
        </button>

        <InvoiceSummary items={items} tax={tax} onChange={onTaxChange} />
      </div>
    </div>
  );
}
