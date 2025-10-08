"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const sp = useSearchParams();
  const next = sp?.get("next") || "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") || "");
    const password = String(form.get("password") || "");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: next,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid credentials");
      return;
    }

    // Redirect handled client side for good UX
    window.location.href = res.url || next;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin sign in</h1>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="space-y-2">
          <label className="block text-sm">Username</label>
          <input
            name="username"
            required
            className="w-full border rounded px-3 py-2"
            autoComplete="username"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full px-3 py-2 rounded bg-black text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}