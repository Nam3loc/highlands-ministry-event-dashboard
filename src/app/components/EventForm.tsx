"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  campus: z.string().min(1).max(200),
  category: z.string().min(1).max(200),
  startDateTime: z.string().min(1),
  endDateTime: z.string().min(1),
  cost: z.coerce.number().min(0),
  isPublished: z.boolean().default(false),
});

type EventFormInput = z.input<typeof formSchema>;
export type EventFormValues = z.infer<typeof formSchema>;

type Props = {
  mode: "create" | "edit";
  initialValues?: Partial<EventFormInput>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  submitLabel?: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

export default function EventForm({ mode, initialValues, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EventFormInput, any, EventFormValues>({
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

  const submit: SubmitHandler<EventFormValues> = async (values) => {
    await onSubmit(values);
  };

  const inputBase =
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm " +
    "shadow-sm outline-none transition " +
    "placeholder:text-zinc-400 " +
    "focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 " +
    "disabled:cursor-not-allowed disabled:bg-zinc-50";

  const labelBase = "text-xs font-medium tracking-wide text-zinc-700";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {mode === "create" ? "Create Event" : "Edit Event"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Keep it simple, clear, and publish when ready.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="px-6 py-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelBase}>TITLE</label>
            <input
              className={inputBase}
              placeholder="e.g., Saturate"
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>

          {/* Description */}
          <div>
            <label className={labelBase}>DESCRIPTION</label>
            <textarea
              className={inputBase + " min-h-[120px] resize-y"}
              placeholder="Share the details people need…"
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {/* Campus / Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelBase}>CAMPUS</label>
              <input
                className={inputBase}
                placeholder="e.g., Grants Mill"
                {...register("campus")}
              />
              <FieldError message={errors.campus?.message} />
            </div>

            <div>
              <label className={labelBase}>CATEGORY</label>
              <input
                className={inputBase}
                placeholder="e.g., Highlands Students"
                {...register("category")}
              />
              <FieldError message={errors.category?.message} />
            </div>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelBase}>START</label>
              <input
                type="datetime-local"
                className={inputBase}
                {...register("startDateTime")}
              />
              <FieldError message={errors.startDateTime?.message} />
            </div>

            <div>
              <label className={labelBase}>END</label>
              <input
                type="datetime-local"
                className={inputBase}
                {...register("endDateTime")}
              />
              <FieldError message={errors.endDateTime?.message} />
            </div>
          </div>

          {/* Cost + Published */}
          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <div>
              <label className={labelBase}>COST</label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  className={inputBase + " pl-7"}
                  {...register("cost")}
                />
              </div>
              <FieldError message={errors.cost?.message} />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">Published</p>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    Toggle on when this is ready to be visible.
                  </p>
                </div>

                {/* modern switch-ish checkbox */}
                <span className="relative inline-flex h-6 w-11 items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("isPublished")}
                  />
                  <span className="absolute inset-0 rounded-full bg-zinc-300 transition peer-checked:bg-zinc-900" />
                  <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition
                          hover:bg-zinc-50 hover:border-zinc-300
                          focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
              >
                ← Back
              </Link>

              <p className="text-xs text-zinc-500 hidden sm:block">
                Fields marked by validation must be completed before saving.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition
                        hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20
                        disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving…"
                : submitLabel ?? (mode === "create" ? "Create Event" : "Save Changes")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}