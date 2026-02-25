import { GET, POST } from "@/app/api/events/route";

const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();

const mockInsert = jest.fn();
const mockValues = jest.fn();
const mockReturning = jest.fn();

jest.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    from: (...args: unknown[]) => mockFrom(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
  },
}));

jest.mock("@/db/schema", () => ({
  events: {
    id: "events.id",
    campus: "events.campus",
    category: "events.category",
    isPublished: "events.isPublished",
    startDateTime: "events.startDateTime",
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: (...args: unknown[]) => ({ op: "eq", args }),
  and: (...args: unknown[]) => ({ op: "and", args }),
  asc: (...args: unknown[]) => ({ op: "asc", args }),
  desc: (...args: unknown[]) => ({ op: "desc", args }),
}));

function makeReq(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe("GET/POST /api/events", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // GET chain: db.select().from().where()?.orderBy()
    mockSelect.mockReturnValue({ from: mockFrom });

    // We support both:
    //  - .from(...).orderBy(...)
    //  - .from(...).where(...).orderBy(...)
    mockFrom.mockReturnValue({
      where: mockWhere,
      orderBy: mockOrderBy,
    });

    mockWhere.mockReturnValue({ orderBy: mockOrderBy });
    mockOrderBy.mockResolvedValue([]);

    // POST chain: db.insert().values().returning()
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({ returning: mockReturning });
    mockReturning.mockResolvedValue([{ id: 1 }]);
  });

  // -------------------------
  // GET tests
  // -------------------------
  test("GET_Success_Returns200AndRows", async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    mockOrderBy.mockResolvedValueOnce(rows);

    const res = await GET(makeReq("http://localhost/api/events"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(rows);
  });

  test("GET_Failure_DbThrows_Returns500", async () => {
    mockSelect.mockImplementationOnce(() => {
      throw new Error("db down");
    });

    const res = await GET(makeReq("http://localhost/api/events"));
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body).toHaveProperty("error", "Internal server error");
  });

  test("GET_EdgeCase_WithFilters_CallsWhere", async () => {
    mockOrderBy.mockResolvedValueOnce([{ id: 3 }]);

    const res = await GET(
      makeReq("http://localhost/api/events?campus=Main&category=Kids&published=true")
    );

    expect(res.status).toBe(200);
    expect(mockWhere).toHaveBeenCalledTimes(1);
  });

  test("GET_EdgeCase_SortStartDesc_StillReturns200", async () => {
    mockOrderBy.mockResolvedValueOnce([{ id: 4 }]);

    const res = await GET(makeReq("http://localhost/api/events?sort=startDesc"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 4 }]);
  });

  // -------------------------
  // POST tests
  // -------------------------
  test("POST_Success_ValidBody_Returns201AndCreated", async () => {
    const created = { id: 99, title: "Highlands Conference" };
    mockReturning.mockResolvedValueOnce([created]);

    const validBody = {
        title: "Highlands Conference",
        description: "A great event",
        campus: "Main",
        category: "Worship",
        startDateTime: "2030-01-01T18:00:00.000Z",
        endDateTime: "2030-01-01T19:00:00.000Z",
        cost: 0,
        isPublished: false,
    };

    const res = await POST(
      makeReq("http://localhost/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody),
      })
    );

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
  });

  test("POST_Failure_InvalidJson_Returns400", async () => {
    const res = await POST(
      makeReq("http://localhost/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Invalid JSON body");
  });

  test("POST_Failure_Validation_Returns400WithIssues", async () => {
    const res = await POST(
      makeReq("http://localhost/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "" }),
      })
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Validation failed");
    expect(body).toHaveProperty("issues");
  });

  test("POST_EdgeCase_ExtraFields_IgnoredOrRejected_ButNot500", async () => {
    const validBodyPlusExtra = {
      title: "Event",
      description: "Desc",
      campus: "Main",
      category: "Kids",
      startDateTime: "2030-01-01T18:00:00.000Z",
      isPublished: false,
      extra: "should not break anything",
    };

    const res = await POST(
      makeReq("http://localhost/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBodyPlusExtra),
      })
    );

    expect([201, 400]).toContain(res.status);
  });

  test("POST_Edge_InsertReturnsEmptyArray_Returns500", async () => {
    mockReturning.mockResolvedValueOnce([]); // edge: DB returned no row

    const validBody = {
        title: "Edge Event",
        description: "Desc",
        campus: "Main",
        category: "Worship",
        startDateTime: "2030-01-01T18:00:00.000Z",
        endDateTime: "2030-01-01T19:00:00.000Z",
        cost: 0,
        isPublished: false,
    };

    const res = await POST(
        makeReq("http://localhost/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validBody),
        })
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Failed to create event");
    });
});