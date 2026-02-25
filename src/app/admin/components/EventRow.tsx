"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PublishToggle from "./PublishToggle";
import { HighlandsEvent } from "@/app/lib/model";

export default function EventRow({ event }: { event: HighlandsEvent }) {
  const [published, setPublished] = useState<boolean>(event.isPublished);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function onDelete() {
    const ok = confirm(`Delete "${event.title}"? This cannot be undone.`);
    if (!ok) return;

    try {
      setIsDeleting(true);

      const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? "Failed to delete event");
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-zinc-900">
            {event.title}
          </h3>

          <span
            className={`text-xs rounded-full px-2 py-1 ${
              published
                ? "bg-green-100 text-green-800"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {published ? "Published" : "Unpublished"}
          </span>
        </div>

        <p className="mt-1 text-sm text-zinc-600">{event.campus}</p>
      </div>

      <div className="w-full sm:w-auto">
        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
          <div className="col-span-2 sm:col-auto">
            <PublishToggle
              id={event.id}
              initialPublished={published}
              onStatusChange={setPublished}
            />
          </div>

          <Link
            href={`/admin/${event.id}`}
            className="inline-flex justify-center rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex justify-center rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}