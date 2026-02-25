import { authorizeAdmin } from "@/app/api/auth/authorize";

describe("authorizeAdmin", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "secret";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("happy path: correct creds => admin user", async () => {
    const res = await authorizeAdmin({ username: "admin", password: "secret" });
    expect(res).toMatchObject({ id: "admin", role: "admin" });
  });

  test("sad path: wrong password => null", async () => {
    const res = await authorizeAdmin({ username: "admin", password: "nope" });
    expect(res).toBeNull();
  });

  test("edge: missing creds => null", async () => {
    const res = await authorizeAdmin(undefined);
    expect(res).toBeNull();
  });
});