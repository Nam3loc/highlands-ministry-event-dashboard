import Link from "next/link";
import { HighlandsEvent } from "../lib/model";
import EventRow from "./components/EventRow";

async function getAllEvents() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export default async function AdminPage() {
  const events = await getAllEvents();

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 flex items-center justify-between">
					<Link
						href="/"
						className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
					>
						← Back to Public
					</Link>

          <div>
            <h1 className="text-3xl font-semibold text-zinc-900">Admin</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Manage annual events.
            </p>
          </div>

          <Link
            href="/admin/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create Event
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 space-y-4">
				{events.map((event: HighlandsEvent) => (
					<EventRow key={event.id} event={event} />
				))}
			</section>
		</main>
  );
}