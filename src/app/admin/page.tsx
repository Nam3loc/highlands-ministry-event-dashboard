import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import EventRow from "@/app/admin/components/EventRow";
import { getAllEventsPaged } from "@/app/lib/data/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1");
  const pageSize = Number(sp.pageSize ?? "6");

  const result = await getAllEventsPaged({ page, pageSize });

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
				<div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-3 items-center">
					<div className="justify-self-start">
						<Link
							href="/"
							className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
						>
							← Back to Public
						</Link>
					</div>

					<div className="text-center">
						<h1 className="text-3xl font-semibold text-zinc-900">Admin</h1>
						<p className="mt-1 text-sm text-zinc-600">Manage annual events.</p>
					</div>

					<div className="justify-self-end">
						<Link
							href="/admin/new"
							className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
						>
							Create Event
						</Link>
					</div>
				</div>
			</section>

			<p className="text-xs text-zinc-400">debug page={page}</p>

      <section className="mx-auto max-w-5xl px-6 py-10 space-y-4">
        {result.data.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}

        <Pagination
          basePath="/admin"
          page={result.page}
          totalPages={result.totalPages}
          pageSize={result.pageSize}
        />
      </section>
    </main>
  );
}