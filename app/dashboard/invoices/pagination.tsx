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
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={{
            query: {
              ...searchParams,
              page: currentPage > 1 ? currentPage - 1 : 1,
            },
          }}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
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
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Link
              href={{
                query: {
                  ...searchParams,
                  page: currentPage > 1 ? currentPage - 1 : 1,
                },
              }}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === i + 1
                    ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
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
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
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
