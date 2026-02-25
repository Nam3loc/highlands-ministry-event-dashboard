"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventForm, { type EventFormValues } from "@/app/components/EventForm";

type Props = { id: string };

export default function EditEventClient({ id }: Props) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<EventFormValues> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setInitialValues(data);
      setLoading(false);
    };
    run();
  }, [id]);

  const onSubmit = async (values: EventFormValues) => {
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error ?? "Failed to update event");
    }

    router.push("/admin");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">Loading event…</p>
        </div>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-900 font-medium">Event not found.</p>
          <p className="mt-1 text-sm text-zinc-600">It may have been deleted or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <EventForm
        mode="edit"
        initialValues={initialValues}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}