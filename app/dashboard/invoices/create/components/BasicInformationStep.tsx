interface BasicInformationProps {
  name: string;
  number: string;
  date: string;
  dueDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicInformationStep({
  name,
  number,
  date,
  dueDate,
  onChange,
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
            className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Invoice Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            required
            value={number}
            onChange={onChange}
            className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
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
              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
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
              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
