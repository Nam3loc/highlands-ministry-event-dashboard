import Image from "next/image";
import AuthButton from "@/app/components/AuthButton";
import Pagination from "@/app/components/Pagination";
import { getPublishedEventsPaged } from "@/app/lib/data/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type Props = { searchParams: Promise<{ page?: string; pageSize?: string }> };

export default async function Home({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1");
  const pageSize = Number(sp.pageSize ?? "6");

  const result = await getPublishedEventsPaged({ page, pageSize });
  const events = result.data;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            Highlands Event Dashboard
          </p>
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

        <Pagination
          basePath="/"
          page={result.page}
          totalPages={result.totalPages}
          pageSize={result.pageSize}
        />
      </section>
    </main>
  );
}