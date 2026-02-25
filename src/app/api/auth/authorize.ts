export async function authorizeAdmin(credentials?: {
  username?: string;
  password?: string;
}) {
  if (
    credentials?.username === process.env.ADMIN_USERNAME &&
    credentials?.password === process.env.ADMIN_PASSWORD
  ) {
    return { id: "admin", name: "Admin", role: "admin" as const };
  }

  return null;
}