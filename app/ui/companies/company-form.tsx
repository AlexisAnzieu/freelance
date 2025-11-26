"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { UploadDropzone } from "@/app/lib/uploadthing";

type CompanyFormProps = {
  title: string;
  onSubmit: (formData: FormData) => Promise<void>;
  defaultValues?: {
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
    notes?: string;
    paymentMethods?: string;
    logoUrl?: string;
  };
  mode?: "create" | "edit";
};

export function CompanyForm({
  title,
  onSubmit,
  defaultValues = {},
  mode = "create",
}: CompanyFormProps) {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<string[]>(() => {
    if (defaultValues.paymentMethods) {
      try {
        return JSON.parse(defaultValues.paymentMethods);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(
    defaultValues.logoUrl ?? null
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploadingLogo) {
      setLogoUploadError("Please wait for the logo upload to finish.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set("paymentMethods", JSON.stringify(paymentMethods));
    formData.set("logoUrl", logoUrl ?? "");
    await onSubmit(formData);
  };

  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, ""]);
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const updatePaymentMethod = (index: number, value: string) => {
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods[index] = value;
    setPaymentMethods(newPaymentMethods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-md bg-white border border-[#e8e8e8] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              required
              defaultValue={defaultValues.companyName}
            />
          </div>

          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              defaultValue={defaultValues.contactName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              required
              defaultValue={defaultValues.email}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              defaultValue={defaultValues.phone}
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
            required
            defaultValue={defaultValues.address}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              required
              defaultValue={defaultValues.city}
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              State (optional)
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              defaultValue={defaultValues.state}
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              required
              defaultValue={defaultValues.postalCode}
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-[#37352f] mb-1.5"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
              required
              defaultValue={defaultValues.country}
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="taxId"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Tax ID (optional)
          </label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors"
            defaultValue={defaultValues.taxId}
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-[#37352f] mb-1.5"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors resize-none"
            defaultValue={defaultValues.notes}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-[#37352f] mb-1.5">
            Company Logo (optional)
          </label>
          {logoUrl ? (
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-[#e8e8e8] bg-white">
                <Image
                  src={logoUrl}
                  alt="Company logo preview"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <button
                  type="button"
                  className="text-[#2383e2] hover:underline"
                  onClick={() => {
                    setLogoUrl(null);
                    setLogoUploadError(null);
                  }}
                >
                  Change logo
                </button>
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    setLogoUrl(null);
                    setLogoUploadError(null);
                  }}
                >
                  Remove logo
                </button>
              </div>
            </div>
          ) : (
            <UploadDropzone
              endpoint="companyLogoUploader"
              className="border-dashed border-2 border-[#e8e8e8] bg-[#fbfbfa] py-6 rounded-md"
              onUploadBegin={() => {
                setIsUploadingLogo(true);
                setLogoUploadError(null);
              }}
              onUploadError={(error: Error) => {
                setIsUploadingLogo(false);
                setLogoUploadError(error.message ?? "Failed to upload logo.");
              }}
              onClientUploadComplete={(
                res: Array<{ url?: string | null; ufsUrl?: string | null }>
              ) => {
                setIsUploadingLogo(false);
                if (!res || res.length === 0) {
                  setLogoUploadError(
                    "Upload finished but no file was received."
                  );
                  return;
                }

                const uploadedUrl = res[0]?.url ?? res[0]?.ufsUrl ?? null;

                if (!uploadedUrl) {
                  setLogoUploadError(
                    "We couldn't retrieve the uploaded logo URL. Please try again."
                  );
                  return;
                }

                setLogoUrl(uploadedUrl);
                setLogoUploadError(null);
              }}
            />
          )}
          {isUploadingLogo && (
            <p className="mt-2 text-sm text-[#9b9a97]">Uploading logo...</p>
          )}
          {logoUploadError && (
            <p className="mt-2 text-sm text-red-600">{logoUploadError}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-[#37352f] mb-1.5">
            Payment Methods (optional)
          </label>
          <div className="space-y-2">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={method}
                  onChange={(e) => updatePaymentMethod(index, e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-2 px-3 text-sm text-[#37352f] focus:border-[#2383e2] focus:outline-none focus:ring-1 focus:ring-[#2383e2] transition-colors resize-none"
                  placeholder="Enter payment details (e.g., Bank account info, PayPal, etc.)"
                />
                <button
                  type="button"
                  onClick={() => removePaymentMethod(index)}
                  className="px-2 py-1 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPaymentMethod}
              className="mt-2 text-sm text-[#2383e2] hover:underline"
            >
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>

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
          {mode === "edit" ? `Save ${title}` : `Create ${title}`}
        </button>
      </div>
    </form>
  );
}
