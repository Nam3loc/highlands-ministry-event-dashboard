"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid username or password.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in to manage events.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Username
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}