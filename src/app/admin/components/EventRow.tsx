"use client";

import Link from "next/link";
import { useState } from "react";
import PublishToggle from "./PublishToggle";
import { HighlandsEvent } from "@/app/lib/model";

export default function EventRow({ event }: { event: HighlandsEvent }) {
  const [published, setPublished] = useState<boolean>(event.isPublished);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-zinc-900">{event.title}</h3>

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

      <div className="flex items-center gap-3">
        <PublishToggle
          id={event.id}
          initialPublished={published}
          onStatusChange={setPublished}
        />

        <Link
          href={`/admin/${event.id}`}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Edit
        </Link>

        <Link
          href={`/admin/${event.id}/delete`}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
        >
          Delete
        </Link>
      </div>
    </div>
  );
}