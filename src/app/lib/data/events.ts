import "server-only";
import { db } from "@/db";
import { events } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const DEFAULT_PUBLIC_PAGE_SIZE = 6;
const DEFAULT_ADMIN_PAGE_SIZE = 6;
const MAX_PAGE_SIZE = 9;

function toInt(value: unknown, fallback: number) {
  const n = typeof value === "string" ? Number(value) : Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function clampPage(page: number) {
  return page < 1 ? 1 : page;
}

function clampPageSize(pageSize: number, fallback: number) {
  const n = pageSize < 1 ? fallback : pageSize;
  return Math.min(n, MAX_PAGE_SIZE);
}

export async function getPublishedEventsPaged(input?: { page?: number; pageSize?: number; }): Promise<PaginatedResult<typeof events.$inferSelect>> {
  const page = clampPage(toInt(input?.page, 1));
  const pageSize = clampPageSize(toInt(input?.pageSize, DEFAULT_PUBLIC_PAGE_SIZE), DEFAULT_PUBLIC_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  const where = eq(events.isPublished, true);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(events)
    .where(where);

  const data = await db
    .select()
    .from(events)
    .where(where)
    .orderBy(asc(events.startDateTime))
    .limit(pageSize)
    .offset(offset);

  const total = Number(count) || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return { data, page, pageSize, total, totalPages };
}

export async function getAllEventsPaged(input?: { page?: number; pageSize?: number; }): Promise<PaginatedResult<typeof events.$inferSelect>> {
  const page = clampPage(toInt(input?.page, 1));
  const pageSize = clampPageSize(toInt(input?.pageSize, DEFAULT_ADMIN_PAGE_SIZE), DEFAULT_ADMIN_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(events);

  const data = await db
    .select()
    .from(events)
    .orderBy(asc(events.startDateTime))
    .limit(pageSize)
    .offset(offset);

  const total = Number(count) || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return { data, page, pageSize, total, totalPages };
}

export async function getEventById(id: string) {
  return db.select().from(events).where(eq(events.id, id)).limit(1);
}

export async function getPublishedEvents() {
  return (await getPublishedEventsPaged({ page: 1, pageSize: MAX_PAGE_SIZE })).data;
}

export async function getAllEvents() {
  return (await getAllEventsPaged({ page: 1, pageSize: MAX_PAGE_SIZE })).data;
}