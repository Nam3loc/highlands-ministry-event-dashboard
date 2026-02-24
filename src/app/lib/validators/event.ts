import { z } from "zod";

export const eventIdSchema = z.string().uuid("Invalid event id");

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  campus: z.string().min(1).max(200),
  category: z.string().min(1).max(200),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  cost: z.number().min(0),
  isPublished: z.boolean(),
}).superRefine((val, ctx) => {
  if (val.endDateTime < val.startDateTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "endDateTime must be after startDateTime",
      path: ["endDateTime"],
    });
  }
});

export const updateEventSchema = createEventSchema;

// Optional: for admin “toggle published” PATCH later
export const patchPublishedSchema = z.object({
  isPublished: z.boolean(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;