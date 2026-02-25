"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
        >
          Admin Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
    >
      Log in
    </Link>
  );
}