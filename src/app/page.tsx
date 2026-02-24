import Image from "next/image";
import { getPublishedEvents } from "@/app/lib/data/events";

function resolveImageKey(title: string): string {
  const map: Record<string, string> = {
    "Freedom Conference": "freedom",
    "Marriage Conference": "marriage_conference",
    "Motion Conference": "motion",
    "Serve Day": "serve_day",
    "Summer Blast": "summer_blast",
    "21 Days of Prayer and Fasting": "twenty_one_dop",
  };

  return map[title] ?? "default";
}

export default async function Home() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Events
          </h1>
          <p className="mt-4 text-lg text-zinc-600">Highlands Event Dashboard</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const imageKey = resolveImageKey(event.title);
            const imagePosition =
              event.title === "Freedom Conference" ||
              event.title === "Motion Conference"
                ? "object-[center_25%]"
                : "object-center";

            return (
              <div
                key={event.id}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={`/assets/${imageKey}.webp`}
                    alt={event.title}
                    fill
                    className={`object-cover ${imagePosition}`}
                    priority
                  />
                </div>

                <h3 className="text-xl font-semibold text-zinc-900">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500">
                  {new Date(event.startDateTime).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                {event.description && (
                  <p className="mt-3 text-sm text-zinc-600 line-clamp-3">
                    {event.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}