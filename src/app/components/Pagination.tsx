import Link from "next/link";

export default function Pagination({ basePath, page, totalPages, pageSize }: {
  basePath: string;
  page: number;
  totalPages: number;
  pageSize: number;
}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const prevHref = `${basePath}?page=${page - 1}&pageSize=${pageSize}`;
  const nextHref = `${basePath}?page=${page + 1}&pageSize=${pageSize}`;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      {prevDisabled ? (
        <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-400">
          Previous
        </span>
      ) : (
        <Link
          href={prevHref}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Previous
        </Link>
      )}

      <span className="text-sm text-zinc-600">
        Page <span className="font-medium text-zinc-900">{page}</span> of{" "}
        <span className="font-medium text-zinc-900">{totalPages}</span>
      </span>

      {nextDisabled ? (
        <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-400">
          Next
        </span>
      ) : (
        <Link
          href={nextHref}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Next
        </Link>
      )}
    </div>
  );
}