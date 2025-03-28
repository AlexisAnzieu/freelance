"use client";

import { useState } from "react";
import { CompanyWithTypes } from "@/app/lib/db";
import { createInvoice } from "./actions";
import { InvoiceStepProgress } from "./components/InvoiceStepProgress";
import { BasicInformationStep } from "./components/BasicInformationStep";
import { CompanyDetailsStep } from "./components/CompanyDetailsStep";
import { ActivitiesStep } from "./components/ActivitiesStep";
import { InvoicePreview } from "./components/InvoicePreview";
import { invoiceSchema } from "./schemas/invoice";
import { formatZodErrors, ValidationErrors } from "./utils/format-errors";
import { DEFAULT_TAX_RATE } from "./components/InvoiceSummary";

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
  name?: string;
}

interface FormProps {
  customers: CompanyWithTypes[];
  contractors: CompanyWithTypes[];
  prefillData?: PrefillData;
}

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Company Details" },
  { id: 3, name: "Activities" },
];

export function Form({ customers, contractors, prefillData }: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: prefillData?.name || "",
    customerId: prefillData?.customerId || "",
    contractorId: prefillData?.contractorId || "",
    number: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    tax: DEFAULT_TAX_RATE,
    status: "DRAFT",
    companies: [
      ...(prefillData?.customerId
        ? [customers.find((c) => c.id === prefillData.customerId)]
        : []),
      ...(prefillData?.contractorId
        ? [contractors.find((c) => c.id === prefillData.contractorId)]
        : []),
    ].filter((company): company is CompanyWithTypes => company !== undefined),
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
        const newData = {
          ...prev,
          [name]: name === "tax" ? Number(value) : value,
        };

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

  const handleAddActivity = () => {
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
    }));
  };

  const validateForm = () => {
    const result = invoiceSchema.safeParse(formData);

    if (!result.success) {
      setErrors(formatZodErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  return (
    <form
      action={async (formSubmitData: FormData) => {
        try {
          if (!validateForm()) {
            return;
          }

          // Add required invoice data
          const requiredFields = [
            "name",
            "number",
            "date",
            "dueDate",
            "tax",
            "status",
            "customerId",
            "contractorId",
            "teamId",
          ];

          requiredFields.forEach((field) => {
            formSubmitData.append(
              field,
              String(formData[field as keyof typeof formData])
            );
          });

          // Add items data with explicit typing
          formData.items.forEach((item: InvoiceItem, index: number) => {
            formSubmitData.append(`items[${index}].name`, item.name);
            formSubmitData.append(
              `items[${index}].quantity`,
              String(item.quantity)
            );
            formSubmitData.append(
              `items[${index}].unitaryPrice`,
              String(item.unitaryPrice)
            );
            if (item.timeEntryId) {
              formSubmitData.append(
                `items[${index}].timeEntryId`,
                item.timeEntryId
              );
            }
          });

          await createInvoice(formSubmitData);
        } catch (error) {
          console.error("Error submitting invoice:", error);
          throw error;
        }
      }}
      className="max-w-[1400px] mx-auto bg-[#F8FAFC] p-6"
    >
      <InvoiceStepProgress
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 1 ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <BasicInformationStep
              name={formData.name}
              number={formData.number}
              date={formData.date}
              dueDate={formData.dueDate}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* Step 2: Company Details */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 2 ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <CompanyDetailsStep
              customerId={formData.customerId}
              contractorId={formData.contractorId}
              customers={customers}
              contractors={contractors}
              onChange={handleChange}
              errors={errors}
            />
          </div>

          {/* Step 3: Activities */}
          <div
            className={`transition-all duration-300 ${
              currentStep === 3 ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <ActivitiesStep
              items={formData.items}
              tax={formData.tax}
              onItemChange={handleChange}
              onTaxChange={handleChange}
              onAddActivity={handleAddActivity}
              errors={errors}
            />
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-500 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <InvoicePreview formData={formData} />
      </div>
    </form>
  );
}
