import { GET, PUT, DELETE } from "@/app/api/events/[id]/route";

const UUID = "550e8400-e29b-41d4-a716-446655440000";
const UUID2 = "550e8400-e29b-41d4-a716-446655440001";
const BAD_ID = "not-a-uuid";

const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockWhere = jest.fn();
const mockLimit = jest.fn();

const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockUpdateWhere = jest.fn();
const mockUpdateReturning = jest.fn();

const mockDelete = jest.fn();
const mockDeleteWhere = jest.fn();
const mockDeleteReturning = jest.fn();

jest.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

jest.mock("@/db/schema", () => ({
  events: { id: "events.id" },
}));

jest.mock("drizzle-orm", () => ({
  eq: (...args: unknown[]) => ({ op: "eq", args }),
}));

function makeReq(url: string, init?: RequestInit) {
  return new Request(url, init);
}

type RouteContext = { params: Promise<{ id: string }> };
function ctx(id: string): RouteContext {
  return { params: Promise.resolve({ id }) };
}

describe("GET/PUT/DELETE /api/events/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // GET chain
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([{ id: UUID, title: "Event" }]);

    // PUT chain
    mockUpdate.mockReturnValue({ set: mockSet });
    mockSet.mockReturnValue({ where: mockUpdateWhere });
    mockUpdateWhere.mockReturnValue({ returning: mockUpdateReturning });
    mockUpdateReturning.mockResolvedValue([{ id: UUID, title: "Updated" }]);

    // DELETE chain
    mockDelete.mockReturnValue({ where: mockDeleteWhere });
    mockDeleteWhere.mockReturnValue({ returning: mockDeleteReturning });
    mockDeleteReturning.mockResolvedValue([{ id: UUID }]);
  });

  // -------------------------
  // GET
  // -------------------------
  test("GET_Success_Returns200", async () => {
    mockLimit.mockResolvedValueOnce([{ id: UUID, title: "Found" }]);

    const res = await GET(makeReq(`http://localhost/api/events/${UUID}`), ctx(UUID));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toMatchObject({ id: UUID, title: "Found" });
  });

  test("GET_Failure_InvalidId_Returns400", async () => {
    const res = await GET(makeReq("http://localhost/api/events/bad"), ctx(BAD_ID));
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty("error", "Invalid event id");
  });

  test("GET_EdgeCase_NotFound_Returns404", async () => {
    mockLimit.mockResolvedValueOnce([]);

    const res = await GET(makeReq(`http://localhost/api/events/${UUID2}`), ctx(UUID2));
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body).toHaveProperty("error", "Event not found");
  });

  test("GET_Failure_DbThrows_Returns500", async () => {
    mockSelect.mockImplementationOnce(() => {
      throw new Error("db down");
    });

    const res = await GET(makeReq(`http://localhost/api/events/${UUID}`), ctx(UUID));
    expect(res.status).toBe(500);
  });

  // -------------------------
  // PUT
  // -------------------------
  test("PUT_Success_Returns200", async () => {
    mockUpdateReturning.mockResolvedValueOnce([{ id: UUID, title: "Updated" }]);

    const res = await PUT(
      makeReq(`http://localhost/api/events/${UUID}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      }),
      ctx(UUID)
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: UUID, title: "Updated" });
  });

  test("PUT_Failure_InvalidId_Returns400", async () => {
    const res = await PUT(
      makeReq("http://localhost/api/events/bad", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      }),
      ctx(BAD_ID)
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Invalid event id");
  });

  test("PUT_Failure_InvalidJson_Returns400", async () => {
    const res = await PUT(
      makeReq(`http://localhost/api/events/${UUID}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
      ctx(UUID)
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Invalid JSON body");
  });

  test("PUT_EdgeCase_EmptyObject_Returns400_NoFieldsToUpdate", async () => {
    const res = await PUT(
      makeReq(`http://localhost/api/events/${UUID}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
      ctx(UUID)
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "No fields to update");
  });

  test("PUT_EdgeCase_NotFound_Returns404", async () => {
    mockUpdateReturning.mockResolvedValueOnce([]);

    const res = await PUT(
      makeReq(`http://localhost/api/events/${UUID2}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Updated" }),
      }),
      ctx(UUID2)
    );

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Event not found");
  });

  // -------------------------
  // DELETE
  // -------------------------
  test("DELETE_Success_Returns200", async () => {
    mockDeleteReturning.mockResolvedValueOnce([{ id: UUID }]);

    const res = await DELETE(
      makeReq(`http://localhost/api/events/${UUID}`, { method: "DELETE" }),
      ctx(UUID)
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  test("DELETE_Failure_NotFound_Returns404", async () => {
    mockDeleteReturning.mockResolvedValueOnce([]);

    const res = await DELETE(
      makeReq(`http://localhost/api/events/${UUID2}`, { method: "DELETE" }),
      ctx(UUID2)
    );

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Not found");
  });

  test("DELETE_EdgeCase_InvalidId_Returns400_IfYouValidate", async () => {
    const res = await DELETE(
      makeReq("http://localhost/api/events/bad", { method: "DELETE" }),
      ctx(BAD_ID)
    );
    
    expect(res.status).toBe(400);
  });
});