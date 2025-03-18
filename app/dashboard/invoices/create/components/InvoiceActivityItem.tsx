interface InvoiceActivityItemProps {
  id: string;
  name: string;
  quantity: number;
  unitaryPrice: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}

export function InvoiceActivityItem({
  id,
  name,
  quantity,
  unitaryPrice,
  onChange,
}: InvoiceActivityItemProps) {
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
          className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
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
          min="1"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => onChange(e, id)}
          className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
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
          min="0"
          step="0.01"
          placeholder="Enter price per unit"
          value={unitaryPrice}
          onChange={(e) => onChange(e, id)}
          className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>
  );
}
