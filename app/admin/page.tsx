"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/guestbook");
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-sm p-8">
        <h1 className="mb-6 font-[var(--font-display)] text-xl font-bold text-foreground">
          Admin
        </h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full border-b border-border bg-transparent pb-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none"
          autoFocus
        />
        {error && (
          <p className="mb-4 font-mono text-xs text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-xl bg-foreground px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
