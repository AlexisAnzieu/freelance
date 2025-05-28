"use client";

import { useRouter } from "next/navigation";
import { CompanyWithTypes } from "@/app/lib/db";
import { COMPANY_TYPES, CURRENCIES } from "@/app/lib/constants";
import { filterCompaniesByType } from "@/app/lib/db";
import { useActionState } from "react";
import { useState, useEffect } from "react";
import MultiSelect from "@/app/ui/multi-select";

interface ProjectFormState {
  errors?: {
    name?: string[];
    description?: string[];
    companies?: string[];
    currency?: string[];
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
      <div className="relative rounded-2xl bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl p-8 shadow-lg space-y-8 border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-50 rounded-2xl pointer-events-none" />
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Project Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={defaultValues.name}
              className="block w-full rounded-xl border-0 py-2 px-3 text-gray-900 shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-inset ring-gray-300/50 placeholder:text-gray-400/70 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 sm:text-sm sm:leading-6 transition-all duration-300"
              aria-describedby="name-error"
            />
          </div>
          {state.errors?.name && (
            <div
              id="name-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
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
            className="block text-sm font-medium leading-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-xl border-0 py-2 px-3 text-gray-900 shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-inset ring-gray-300/50 placeholder:text-gray-400/70 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 sm:text-sm sm:leading-6 transition-all duration-300"
              aria-describedby="description-error"
              defaultValue={defaultValues.description}
            />
          </div>
          {state.errors?.description && (
            <div
              id="description-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
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
            className="block text-sm font-medium leading-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Currency
          </label>
          <div className="mt-2">
            <select
              id="currency"
              name="currency"
              defaultValue={defaultValues.currency || "USD"}
              className="block w-full rounded-xl border-0 py-2 px-3 text-gray-900 shadow-sm bg-white/50 backdrop-blur-sm ring-1 ring-inset ring-gray-300/50 placeholder:text-gray-400/70 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 sm:text-sm sm:leading-6 transition-all duration-300"
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
              className="mt-2 text-sm text-red-500"
            >
              {state.errors.currency.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="customer-companies"
              className="block text-sm font-medium leading-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
            >
              Customer Companies
            </label>
            <div className="mt-2">
              <MultiSelect
                options={customers.map((company) => ({
                  id: company.id,
                  label: company.companyName,
                }))}
                value={selectedCustomers}
                onChange={setSelectedCustomers}
                name="companies"
                placeholder="Select customer companies..."
                gradientFrom="blue-500"
                gradientTo="purple-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contractor-companies"
              className="block text-sm font-medium leading-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
            >
              Contractor Companies
            </label>
            <div className="mt-2">
              <MultiSelect
                options={contractors.map((company) => ({
                  id: company.id,
                  label: company.companyName,
                }))}
                value={selectedContractors}
                onChange={setSelectedContractors}
                name="companies"
                placeholder="Select contractor companies..."
                gradientFrom="blue-500"
                gradientTo="purple-500"
              />
            </div>
          </div>

          {state.errors?.companies && (
            <div
              id="companies-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
            >
              {state.errors.companies.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {state.errors?._form && (
          <div className="rounded-md bg-red-50 p-4 mt-6">
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

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-500 hover:to-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-300 hover:scale-[1.02]"
          >
            {defaultValues.id ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </form>
  );
}
