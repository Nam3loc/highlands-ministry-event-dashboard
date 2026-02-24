import Image from "next/image";
import { getPublishedEvents } from "@/app/lib/data/events";
import AuthButton from "@/app/components/AuthButton";

const IMAGE_MAP: Record<string, string> = {
  "21 Days of Prayer and Feasting": "twenty_one_dop.webp",
  "Freedom Conference": "freedom.webp",
  "Marriage Conference": "marriage_conference.webp",
  "Motion Conference": "motion.webp",
  "Serve Day": "serve_day.webp",
  "Summer Blast": "summer_blast.webp",
  "21 Days of Prayer and Fasting": "twenty_one_dop.webp",
};

const DEFAULT_IMAGE_FILE = "highlands_logo.jpg";

function resolveImageFile(title: string): string {
  return IMAGE_MAP[title] ?? DEFAULT_IMAGE_FILE;
}

export default async function Home() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Events
          </h1>
          <p className="mt-4 text-lg text-zinc-600">Highlands Event Dashboard</p>
        </div>

        <div className="fixed right-6 top-6 z-50">
          <AuthButton />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const imageFile = resolveImageFile(event.title);
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
                    src={`/assets/${imageFile}`}
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