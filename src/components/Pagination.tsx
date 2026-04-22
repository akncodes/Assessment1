import Link from "next/link";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  query?: string;
}

export function Pagination({ page, total, pageSize, query }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }

  const prevParams = new URLSearchParams(params);
  prevParams.set("page", String(Math.max(1, page - 1)));

  const nextParams = new URLSearchParams(params);
  nextParams.set("page", String(Math.min(totalPages, page + 1)));

  const pages: number[] = [];
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, page + 1);
  for (let current = startPage; current <= endPage; current += 1) {
    pages.push(current);
  }

  return (
    <div className="mt-8 flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
      <Link
        href={`/?${prevParams.toString()}`}
        className={`rounded-lg px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-(--paper-strong)"}`}
      >
        Previous
      </Link>
      <div className="flex items-center gap-1">
        {pages.map((item) => {
          const pageParams = new URLSearchParams(params);
          pageParams.set("page", String(item));

          const isCurrent = item === page;
          return (
            <Link
              key={item}
              href={`/?${pageParams.toString()}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`rounded-lg px-3 py-2 font-semibold transition ${
                isCurrent
                  ? "bg-foreground text-white"
                  : "text-(--ink-soft) hover:bg-(--paper-strong)"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>
      <Link
        href={`/?${nextParams.toString()}`}
        className={`rounded-lg px-3 py-2 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-(--paper-strong)"}`}
      >
        Next
      </Link>
    </div>
  );
}
