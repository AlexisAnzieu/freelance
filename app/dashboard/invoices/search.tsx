"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-xs">
      <label htmlFor="search" className="sr-only">
        Search invoices
      </label>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
          <svg
            className="h-4 w-4 text-[#9b9a97] group-focus-within:text-[#37352f]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border border-[#e8e8e8] bg-[#ffffff] py-1.5 pl-8 pr-3 text-sm text-[#37352f] placeholder:text-[#9b9a97] transition-colors duration-100
          focus:outline-none focus:border-[#2eaadc] focus:ring-1 focus:ring-[#2eaadc] hover:border-[#d0d0d0]"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </div>
  );
}
