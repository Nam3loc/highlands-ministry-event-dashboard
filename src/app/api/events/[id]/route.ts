import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eventIdSchema, updateEventSchema } from "@/app/lib/validators/event";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const parsedId = eventIdSchema.safeParse((await params).id);

    if (!parsedId.success) {
      return NextResponse.json(
        {
          error: "Invalid event id",
          issues: parsedId.error.issues,
        },
        { status: 400 }
      );
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, parsedId.data))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    console.error("GET /api/events/:id error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const parsedId = eventIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "Invalid event id", details: parsedId.error.flatten() },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsedBody = updateEventSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsedBody.error.issues,
        },
        { status: 400 }
      );
    }

    if (Object.keys(parsedBody.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(events)
      .set(parsedBody.data)
      .where(eq(events.id, parsedId.data))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("PUT /api/events/:id error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const parsedId = eventIdSchema.safeParse((await params).id);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: "Invalid event id", issues: parsedId.error.issues },
      { status: 400 }
    );
  }

  const [deleted] = await db
    .delete(events)
    .where(eq(events.id, parsedId.data))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true }, { status: 200 });
}