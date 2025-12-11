"use client";

import { useRouter } from "next/navigation";
import { CompanyWithTypes } from "@/app/lib/db";
import { COMPANY_TYPES, CURRENCIES } from "@/app/lib/constants";
import { filterCompaniesByType } from "@/app/lib/db";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import MultiSelect from "@/app/ui/multi-select";
import ColorPicker from "@/app/ui/color-picker";

interface ProjectFormState {
  errors?: {
    name?: string[];
    description?: string[];
    companies?: string[];
    currency?: string[];
    color?: string[];
    _form?: string[];
  };
  redirect?: string;
}

interface ProjectFormProps {
  companies: CompanyWithTypes[];
  action: (
    prevState: ProjectFormState,
    formData: FormData
  ) => Promise<ProjectFormState>;
  defaultValues?: {
    id?: string;
    name?: string;
    description?: string;
    currency?: string;
    color?: string;
    companies?: CompanyWithTypes[];
  };
}

export default function ProjectForm({
  companies,
  action,
  defaultValues = {},
}: ProjectFormProps) {
  const router = useRouter();
  const [state, dispatch] = useActionState(action, { errors: {} });

  const customers = filterCompaniesByType(companies, COMPANY_TYPES.CUSTOMER);
  const contractors = filterCompaniesByType(
    companies,
    COMPANY_TYPES.CONTRACTOR
  );

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>(
    filterCompaniesByType(defaultValues.companies, COMPANY_TYPES.CUSTOMER).map(
      (company) => company.id
    )
  );
  const [selectedContractors, setSelectedContractors] = useState<string[]>(
    filterCompaniesByType(
      defaultValues.companies,
      COMPANY_TYPES.CONTRACTOR
    ).map((company) => company.id)
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    defaultValues.color || ""
  );

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect, router]);

  return (
    <form action={dispatch}>
      {defaultValues.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}
      <div className="rounded-md bg-white border border-[#e8e8e8] p-5 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Project Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={defaultValues.name}
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              aria-describedby="name-error"
            />
          </div>
          {state.errors?.name && (
            <div
              id="name-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {state.errors.name.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors resize-none"
              aria-describedby="description-error"
              defaultValue={defaultValues.description}
            />
          </div>
          {state.errors?.description && (
            <div
              id="description-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {state.errors.description.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Currency
          </label>
          <div className="mt-1">
            <select
              id="currency"
              name="currency"
              defaultValue={defaultValues.currency || "CAD"}
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              aria-describedby="currency-error"
            >
              {Object.entries(CURRENCIES).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>
          {state.errors?.currency && (
            <div
              id="currency-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {state.errors.currency.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37352f] mb-1.5">
            Project Color
          </label>
          <div className="mt-1">
            <ColorPicker
              value={selectedColor}
              onChange={setSelectedColor}
              name="color"
            />
          </div>
          {state.errors?.color && (
            <div
              id="color-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {state.errors.color.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="customer-companies"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Customer Companies
            </label>
            <div className="mt-1">
              <MultiSelect
                options={customers.map((company) => ({
                  id: company.id,
                  label: company.companyName,
                }))}
                value={selectedCustomers}
                onChange={setSelectedCustomers}
                name="companies"
                placeholder="Select customer companies..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contractor-companies"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Contractor Companies
            </label>
            <div className="mt-1">
              <MultiSelect
                options={contractors.map((company) => ({
                  id: company.id,
                  label: company.companyName,
                }))}
                value={selectedContractors}
                onChange={setSelectedContractors}
                name="companies"
                placeholder="Select contractor companies..."
              />
            </div>
          </div>

          {state.errors?.companies && (
            <div
              id="companies-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-600"
            >
              {state.errors.companies.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {state.errors?._form && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 mt-5">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {defaultValues.id
                    ? "Error updating project"
                    : "Error creating project"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc space-y-1 pl-5">
                    {state.errors._form.map((error: string) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-[#37352f] hover:bg-[#ebebea] px-3 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#2383e2] px-3 py-2 text-sm font-medium text-white hover:bg-[#1a73d4] transition-colors"
          >
            {defaultValues.id ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
