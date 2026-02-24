import { db } from "@/db";
import { events } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getPublishedEvents() {
  return db
    .select()
    .from(events)
    .where(eq(events.isPublished, true))
    .orderBy(asc(events.startDateTime));
}

export async function getAllEvents() {
    return db
        .select()
        .from(events)
        .orderBy(asc(events.startDateTime));
}

export async function getEventById(id: string) {
    return db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);
}