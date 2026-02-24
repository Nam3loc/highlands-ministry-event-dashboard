import { NextResponse } from "next/server";
import { asc, desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { createEventSchema } from "@/app/lib/validators/event";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const campus = url.searchParams.get("campus");
    const category = url.searchParams.get("category");
    const published = url.searchParams.get("published"); // returns string: "true" | "false" | null
    const sort = url.searchParams.get("sort");

    const whereClauses = [];

    if (campus) whereClauses.push(eq(events.campus, campus));
    if (category) whereClauses.push(eq(events.category, category));
    if (published === "true") whereClauses.push(eq(events.isPublished, true));
    if (published === "false") whereClauses.push(eq(events.isPublished, false));

    // const orderBy =
    //   sort === "startDesc"
    //     ? desc(events.startDateTime)
    //     : asc(events.startDateTime);
    const orderBy = events.startDateTime;

    const rows = await db
      .select()
      .from(events)
      .where(whereClauses.length ? and(...whereClauses) : undefined)
      .orderBy(orderBy);

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/events failed:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = createEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(events)
    .values(parsed.data)
    .returning();

  return NextResponse.json(created, { status: 201 });
}