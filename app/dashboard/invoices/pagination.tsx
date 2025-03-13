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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 mt-6 rounded-lg shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={{
            query: {
              ...searchParams,
              page: currentPage > 1 ? currentPage - 1 : 1,
            },
          }}
          className={`relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 ${
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
          className={`relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 ${
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
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * 10, totalPages * 10)}
            </span>{" "}
            of <span className="font-medium">{totalPages * 10}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-lg shadow-sm"
            aria-label="Pagination"
          >
            <Link
              href={{
                query: {
                  ...searchParams,
                  page: currentPage > 1 ? currentPage - 1 : 1,
                },
              }}
              className={`relative inline-flex items-center rounded-l-lg px-3 py-2 text-gray-500 border border-gray-200 hover:text-gray-700 hover:border-gray-300 bg-white transition-all duration-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-gray-50"
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentPage === i + 1
                    ? "z-10 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                    : "text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white"
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
              className={`relative inline-flex items-center rounded-r-lg px-3 py-2 text-gray-500 border border-gray-200 hover:text-gray-700 hover:border-gray-300 bg-white transition-all duration-200 ${
                currentPage >= totalPages
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-gray-50"
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
