"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  initialPublished: boolean;
  onStatusChange?: (next: boolean) => void;
};

export default function PublishToggle({ id, initialPublished, onStatusChange }: Props) {
  const [published, setPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  async function setNext(next: boolean) {
    setPublished(next);
    onStatusChange?.(next);

    console.log("PUT /api/events id:", id, "typeof:", typeof id);
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: next }),
    });

    if (!res.ok) {
      let msg = "Failed to update publish status due to being past the events end date.";
      try {
        const data = await res.json();
        msg = data?.error || data?.message || msg;
      } catch {}

      setPublished(!next);
      onStatusChange?.(!next);

      alert(msg);
    }
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => setNext(!published))}
      className={`
        relative inline-flex h-7 w-12 items-center rounded-full border transition
        ${published ? "bg-green-600 border-green-600" : "bg-zinc-200 border-zinc-200"}
        ${isPending ? "opacity-60" : "hover:opacity-90"}
      `}
      aria-pressed={published}
      aria-label={published ? "Set Unpublished" : "Set Published"}
      title={published ? "Published" : "Unpublished"}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow transition
          ${published ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}