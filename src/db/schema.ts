import { pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    campus: text("campus").notNull(),
    category: text("category").notNull(),
    startDateTime: timestamp("start_date_time", { withTimezone: false }).notNull(),
    endDateTime: timestamp("end_date_time", { withTimezone: false }).notNull(),
    cost: integer("cost").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(false),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    publishedStartIdx: index("events_published_start_idx").on(t.isPublished, t.startDateTime),
    campusIdx: index("events_campus_idx").on(t.campus),
    categoryIdx: index("events_category_idx").on(t.category),
  })
);