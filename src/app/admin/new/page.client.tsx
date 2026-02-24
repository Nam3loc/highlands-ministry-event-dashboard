"use client";

import { useRouter } from "next/navigation";
import EventForm, { type EventFormValues } from "@/app/components/EventForm";

export default function NewEventPageClient() {
  const router = useRouter();

  const onSubmit = async (values: EventFormValues) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create event");
    }

    router.push("/admin");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <EventForm mode="create" onSubmit={onSubmit} />
    </div>
  );
}