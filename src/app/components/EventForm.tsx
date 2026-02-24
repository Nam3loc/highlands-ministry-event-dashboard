// src/components/events/EventForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  campus: z.string().min(1).max(200),
  category: z.string().min(1).max(200),
  startDateTime: z.string().min(1), // datetime-local
  endDateTime: z.string().min(1),
  cost: z.coerce.number().min(0),
  isPublished: z.boolean(),
});

export type EventFormValues = z.infer<typeof formSchema>;

type Props = {
  mode: "create" | "edit";
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  submitLabel?: string;
};

export default function EventForm({ mode, initialValues, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      campus: "",
      category: "",
      startDateTime: "",
      endDateTime: "",
      cost: 0,
      isPublished: false,
      ...initialValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input className="w-full border rounded p-2" {...register("title")} />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="w-full border rounded p-2" rows={5} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Campus</label>
          <input className="w-full border rounded p-2" {...register("campus")} />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input className="w-full border rounded p-2" {...register("category")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Start</label>
          <input type="datetime-local" className="w-full border rounded p-2" {...register("startDateTime")} />
        </div>
        <div>
          <label className="block text-sm font-medium">End</label>
          <input type="datetime-local" className="w-full border rounded p-2" {...register("endDateTime")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-sm font-medium">Cost</label>
          <input type="number" step="0.01" className="w-full border rounded p-2" {...register("cost")} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublished")} />
          Published
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
      >
        {submitLabel ?? (mode === "create" ? "Create Event" : "Save Changes")}
      </button>
    </form>
  );
}