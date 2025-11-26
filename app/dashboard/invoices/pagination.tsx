import Link from "next/link";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  searchParams: { [key: string]: string | undefined };
}

export function Pagination({
  totalPages,
  currentPage,
  searchParams,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-[#e8e8e8] px-4 py-3 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={{
            query: {
              ...searchParams,
              page: currentPage > 1 ? currentPage - 1 : 1,
            },
          }}
          className={`inline-flex items-center rounded border border-[#e8e8e8] bg-white px-3 py-1.5 text-sm font-medium text-[#37352f] transition-colors duration-100 hover:bg-[#f7f7f5] ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
        >
          Previous
        </Link>
        <Link
          href={{
            query: {
              ...searchParams,
              page: currentPage < totalPages ? currentPage + 1 : totalPages,
            },
          }}
          className={`inline-flex items-center rounded border border-[#e8e8e8] bg-white px-3 py-1.5 text-sm font-medium text-[#37352f] transition-colors duration-100 hover:bg-[#f7f7f5] ${
            currentPage >= totalPages
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }`}
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#787774]">
            Showing{" "}
            <span className="font-medium text-[#37352f]">
              {(currentPage - 1) * 10 + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#37352f]">
              {Math.min(currentPage * 10, totalPages * 10)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#37352f]">
              {totalPages * 10}
            </span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md"
            aria-label="Pagination"
          >
            <Link
              href={{
                query: {
                  ...searchParams,
                  page: currentPage > 1 ? currentPage - 1 : 1,
                },
              }}
              className={`inline-flex items-center rounded-l-md px-2.5 py-1.5 text-[#787774] border border-[#e8e8e8] bg-white transition-colors duration-100 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-[#f7f7f5] hover:text-[#37352f]"
              }`}
            >
              <span aria-hidden="true">&lt;</span>
            </Link>
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i + 1}
                href={{
                  query: { ...searchParams, page: i + 1 },
                }}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-colors duration-100 ${
                  currentPage === i + 1
                    ? "z-10 bg-[#2eaadc] text-white border border-[#2eaadc]"
                    : "text-[#37352f] border border-[#e8e8e8] hover:bg-[#f7f7f5] bg-white"
                }`}
              >
                {i + 1}
              </Link>
            ))}
            <Link
              href={{
                query: {
                  ...searchParams,
                  page: currentPage < totalPages ? currentPage + 1 : totalPages,
                },
              }}
              className={`inline-flex items-center rounded-r-md px-2.5 py-1.5 text-[#787774] border border-[#e8e8e8] bg-white transition-colors duration-100 ${
                currentPage >= totalPages
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-[#f7f7f5] hover:text-[#37352f]"
              }`}
            >
              <span aria-hidden="true">&gt;</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
