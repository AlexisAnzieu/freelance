"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format, subMonths } from "date-fns";

interface Contractor {
  id: string;
  companyName: string;
}

interface DashboardFiltersProps {
  contractors: Contractor[];
}

export function DashboardFilters({ contractors }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedContractor = searchParams.get("contractor") || "";

  // Default to last 6 months
  const now = new Date();
  const defaultStart = format(subMonths(now, 6), "yyyy-MM-dd");
  const defaultEnd = format(now, "yyyy-MM-dd");

  const startDate = searchParams.get("startDate") || defaultStart;
  const endDate = searchParams.get("endDate") || defaultEnd;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/dashboard?${params.toString()}`);
  };

  const handleContractorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ contractor: e.target.value || null });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ startDate: e.target.value || null });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ endDate: e.target.value || null });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Contractor Filter */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="contractor-filter"
          className="text-sm text-[#787774] whitespace-nowrap"
        >
          Contractor:
        </label>
        <select
          id="contractor-filter"
          value={selectedContractor}
          onChange={handleContractorChange}
          className="rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-1.5 px-3 text-sm text-[#37352f] hover:bg-[#f7f6f3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2eaadc] focus:border-transparent"
        >
          <option value="">All</option>
          {contractors.map((contractor) => (
            <option key={contractor.id} value={contractor.id}>
              {contractor.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="start-date"
          className="text-sm text-[#787774] whitespace-nowrap"
        >
          Period:
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-1.5 px-3 text-sm text-[#37352f] hover:bg-[#f7f6f3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2eaadc] focus:border-transparent"
        />
        <span className="text-sm text-[#787774]">to</span>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="rounded-md border border-[#e8e8e8] bg-[#fbfbfa] py-1.5 px-3 text-sm text-[#37352f] hover:bg-[#f7f6f3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2eaadc] focus:border-transparent"
        />
      </div>
    </div>
  );
}
