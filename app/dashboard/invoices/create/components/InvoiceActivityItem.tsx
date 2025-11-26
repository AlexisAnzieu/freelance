import { ValidationErrors } from "../utils/format-errors";
import { cn } from "@/app/lib/utils";

interface InvoiceActivityItemProps {
  id: string;
  name: string;
  quantity: number;
  unitaryPrice: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
  errors?: ValidationErrors;
}

export function InvoiceActivityItem({
  id,
  name,
  quantity,
  unitaryPrice,
  onChange,
  errors,
}: InvoiceActivityItemProps) {
  // Convert array-based error paths to the correct format
  const getItemError = (field: string) => {
    const errorKey = `items[${parseInt(id) - 1}].${field}`;
    return errors?.[errorKey];
  };

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-6">
        <label
          htmlFor={`name-${id}`}
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Description
        </label>
        <input
          type="text"
          id={`name-${id}`}
          name="name"
          required
          placeholder="Enter activity description"
          value={name}
          onChange={(e) => onChange(e, id)}
          className={cn(
            "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
            getItemError("name") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {getItemError("name") && (
          <p className="mt-1 text-sm text-red-600">{getItemError("name")}</p>
        )}
      </div>
      <div className="col-span-3">
        <label
          htmlFor={`quantity-${id}`}
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Quantity
        </label>
        <input
          type="number"
          id={`quantity-${id}`}
          name="quantity"
          required
          min="0"
          step="any"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => onChange(e, id)}
          className={cn(
            "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
            getItemError("quantity") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {getItemError("quantity") && (
          <p className="mt-1 text-sm text-red-600">
            {getItemError("quantity")}
          </p>
        )}
      </div>
      <div className="col-span-3">
        <label
          htmlFor={`unitaryPrice-${id}`}
          className="block text-sm font-medium text-[#37352f] mb-1.5"
        >
          Unit Price
        </label>
        <input
          type="number"
          id={`unitaryPrice-${id}`}
          name="unitaryPrice"
          required
          step="any"
          placeholder="Enter price per unit"
          value={unitaryPrice}
          onChange={(e) => onChange(e, id)}
          className={cn(
            "block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] transition-colors focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2]",
            getItemError("unitaryPrice") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {getItemError("unitaryPrice") && (
          <p className="mt-1 text-sm text-red-600">
            {getItemError("unitaryPrice")}
          </p>
        )}
      </div>
    </div>
  );
}
