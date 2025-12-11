"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Contractor {
  id: string;
  companyName: string;
}

interface ContractorFilterProps {
  contractors: Contractor[];
}

export function ContractorFilter({ contractors }: ContractorFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedContractor = searchParams.get("contractor") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("contractor", value);
    } else {
      params.delete("contractor");
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="contractor-filter"
        className="text-sm text-[#787774] whitespace-nowrap"
      >
        Filter by contractor:
      </label>
      <select
        id="contractor-filter"
        value={selectedContractor}
        onChange={handleChange}
        className="rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-1.5 px-3 text-sm text-[#37352f] hover:bg-[#f7f6f3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2eaadc] focus:border-transparent"
      >
        <option value="">All contractors</option>
        {contractors.map((contractor) => (
          <option key={contractor.id} value={contractor.id}>
            {contractor.companyName}
          </option>
        ))}
      </select>
    </div>
  );
}
