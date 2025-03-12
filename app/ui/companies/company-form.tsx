"use client";

import { useRouter } from "next/navigation";

type CompanyFormProps = {
  title: string;
  onSubmit: (formData: FormData) => Promise<void>;
};

export function CompanyForm({ title, onSubmit }: CompanyFormProps) {
  const router = useRouter();

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>

          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium mb-2"
            >
              Contact Name (optional)
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-2">
              State (optional)
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium mb-2"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="block w-full rounded-md border border-gray-200 py-2 px-3"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="taxId" className="block text-sm font-medium mb-2">
            Tax ID (optional)
          </label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-md border border-gray-200 py-2 px-3"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {`Create ${title}`}
        </button>
      </div>
    </form>
  );
}
