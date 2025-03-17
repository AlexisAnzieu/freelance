"use client";

import { useState } from "react";
import { CompanyWithTypes } from "@/app/lib/db";
import { createInvoice } from "./actions";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "../[id]/invoice-pdf";

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitaryPrice: number;
  timeEntryId?: string;
}

interface PrefillData {
  customerId?: string;
  contractorId?: string;
  items?: Array<Omit<InvoiceItem, "id">> | null;
}

interface FormProps {
  customers: CompanyWithTypes[];
  contractors: CompanyWithTypes[];
  prefillData?: PrefillData;
}

export function Form({ customers, contractors, prefillData }: FormProps) {
  const [formData, setFormData] = useState({
    customerId: prefillData?.customerId || "",
    contractorId: prefillData?.contractorId || "",
    number: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tax: 0,
    status: "DRAFT",
    companies: [] as CompanyWithTypes[],
    teamId: "preview",
    items: prefillData?.items
      ? (prefillData.items.map((item, index) => ({
          id: String(index + 1),
          ...item,
        })) as InvoiceItem[])
      : [
          {
            id: "1",
            name: "",
            quantity: 1,
            unitaryPrice: 0,
          },
        ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    itemId?: string
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (itemId) {
        // Update an item
        const newItems = prev.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                [name]:
                  name === "quantity" || name === "unitaryPrice"
                    ? Number(value)
                    : value,
              }
            : item
        );
        return { ...prev, items: newItems };
      } else {
        const newData = { ...prev, [name]: value };

        // Update companies array when customer or contractor changes
        if (name === "customerId" || name === "contractorId") {
          const selectedCompany =
            name === "customerId"
              ? customers.find((c) => c.id === value)
              : contractors.find((c) => c.id === value);

          if (selectedCompany) {
            const otherCompany =
              name === "customerId"
                ? contractors.find((c) => c.id === newData.contractorId)
                : customers.find((c) => c.id === newData.customerId);

            newData.companies = [
              selectedCompany,
              ...(otherCompany ? [otherCompany] : []),
            ];
          }
        }

        return newData;
      }
    });
  };

  return (
    <form
      action={async (data: FormData) => {
        // Add items from state to FormData
        formData.items.forEach((item, index) => {
          data.append(`items[${index}].name`, item.name);
          data.append(`items[${index}].quantity`, String(item.quantity));
          data.append(
            `items[${index}].unitaryPrice`,
            String(item.unitaryPrice)
          );
          // Add time entry ID if it exists
          if (item.timeEntryId) {
            data.append(`items[${index}].timeEntryId`, item.timeEntryId);
          }
        });

        await createInvoice(data);
      }}
      className="space-y-8 max-w-[1400px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Customer
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                  value={formData.customerId}
                  onChange={handleChange}
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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contractor
                </label>
                <select
                  id="contractorId"
                  name="contractorId"
                  className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                  value={formData.contractorId}
                  onChange={handleChange}
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
              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
              value={formData.number}
              onChange={handleChange}
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
                value={formData.date}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                className="block w-full rounded-md border border-gray-200 py-2 px-3"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Activities
              </h3>
              {formData.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6">
                    <label
                      htmlFor={`name-${item.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id={`name-${item.id}`}
                      name="name"
                      required
                      aria-label="Activity description"
                      placeholder="Enter activity description"
                      value={item.name}
                      onChange={(e) => handleChange(e, item.id)}
                      className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor={`quantity-${item.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      name="quantity"
                      required
                      min="1"
                      aria-label="Activity quantity"
                      placeholder="Enter quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, item.id)}
                      className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor={`unitaryPrice-${item.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Unit Price
                    </label>
                    <input
                      type="number"
                      id={`unitaryPrice-${item.id}`}
                      name="unitaryPrice"
                      required
                      min="0"
                      step="0.01"
                      aria-label="Activity unit price"
                      placeholder="Enter price per unit"
                      value={item.unitaryPrice}
                      onChange={(e) => handleChange(e, item.id)}
                      className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-gray-700 shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    items: [
                      ...prev.items,
                      {
                        id: String(prev.items.length + 1),
                        name: "",
                        quantity: 1,
                        unitaryPrice: 0,
                      },
                    ],
                  }))
                }
                className="mt-4 inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 shadow-sm hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Activity
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal:</p>
                <p className="text-lg font-medium">
                  $
                  {formData.items
                    .reduce(
                      (sum, item) => sum + item.quantity * item.unitaryPrice,
                      0
                    )
                    .toFixed(2)}
                </p>
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
                  value={formData.tax}
                  className="block w-full rounded-md border border-gray-200 py-2 px-3"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          style={{ height: "800px" }}
        >
          <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
            <InvoicePDF
              invoice={{
                ...formData,
                id: "preview",
                date: new Date(formData.date),
                dueDate: new Date(formData.dueDate),
                createdAt: new Date(),
                updatedAt: new Date(),
                amount: formData.items.reduce(
                  (sum, item) => sum + item.quantity * item.unitaryPrice,
                  0
                ),
                totalAmount:
                  formData.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitaryPrice,
                    0
                  ) *
                  (1 + Number(formData.tax) / 100),
              }}
            />
          </PDFViewer>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
}
