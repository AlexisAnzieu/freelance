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
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <label
          htmlFor={`name-${id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
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
            "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            getItemError("name") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {getItemError("name") && (
          <p className="mt-1 text-sm text-red-500">{getItemError("name")}</p>
        )}
      </div>
      <div className="col-span-3">
        <label
          htmlFor={`quantity-${id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
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
            "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            getItemError("quantity") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {getItemError("quantity") && (
          <p className="mt-1 text-sm text-red-500">
            {getItemError("quantity")}
          </p>
        )}
      </div>
      <div className="col-span-3">
        <label
          htmlFor={`unitaryPrice-${id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
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
            "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            getItemError("unitaryPrice") &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        {getItemError("unitaryPrice") && (
          <p className="mt-1 text-sm text-red-500">
            {getItemError("unitaryPrice")}
          </p>
        )}
      </div>
    </div>
  );
}
