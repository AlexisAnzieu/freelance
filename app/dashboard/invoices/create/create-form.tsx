import { CompanyWithTypes } from "@/app/lib/db";
import { createInvoice } from "./actions";

interface FormProps {
  customers: CompanyWithTypes[];
  contractors: CompanyWithTypes[];
}

export function Form({ customers, contractors }: FormProps) {
  return (
    <form action={createInvoice} className="space-y-6">
      <div className="rounded-md p-4">
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="customerId"
                className="block text-sm font-medium mb-2"
              >
                Customer
              </label>
              <select
                id="customerId"
                name="customerId"
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              >
                <option value="">Select a customer</option>
                {customers.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contractorId"
                className="block text-sm font-medium mb-2"
              >
                Contractor
              </label>
              <select
                id="contractorId"
                name="contractorId"
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
              >
                <option value="">Select a contractor</option>
                {contractors.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-sm font-medium mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
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
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
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
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
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
              defaultValue="0"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
}
