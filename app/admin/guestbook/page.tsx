"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, LogOut } from "lucide-react";

interface Message {
  id: number;
  name: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminGuestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchMessages() {
    const res = await fetch("/api/admin/guestbook");
    if (!res.ok) return router.push("/admin");
    setMessages(await res.json());
    setLoading(false);
  }

  async function approve(id: number) {
    await fetch(`/api/admin/guestbook/${id}`, { method: "PATCH" });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "approved" } : m))
    );
  }

  async function remove(id: number) {
    await fetch(`/api/admin/guestbook/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  useEffect(() => { fetchMessages(); }, []);

  const pending  = messages.filter((m) => m.status === "pending");
  const approved = messages.filter((m) => m.status === "approved");

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-foreground">
            Guestbook
          </h1>
          <button
            onClick={logout}
            className="flex cursor-pointer items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        {loading ? (
          <p className="font-mono text-xs text-muted-foreground">Loading...</p>
        ) : (
          <>
            {/* Pending */}
            <section className="mb-10">
              <h2 className="mb-4 font-mono text-xs tracking-widest text-muted-foreground">
                PENDING ({pending.length})
              </h2>
              {pending.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground">Nothing pending.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.map((m) => (
                    <MessageCard key={m.id} m={m} onApprove={approve} onDelete={remove} />
                  ))}
                </div>
              )}
            </section>

            {/* Approved */}
            <section>
              <h2 className="mb-4 font-mono text-xs tracking-widest text-muted-foreground">
                APPROVED ({approved.length})
              </h2>
              {approved.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground">None approved yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {approved.map((m) => (
                    <MessageCard key={m.id} m={m} onDelete={remove} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function MessageCard({
  m,
  onApprove,
  onDelete,
}: {
  m: Message;
  onApprove?: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="glass-panel flex items-start justify-between gap-4 p-5">
      <div className="min-w-0 flex-1">
        <span className="mb-1 block font-mono text-xs text-muted-foreground">
          {m.name} · {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <p className="font-sans text-sm font-light leading-relaxed text-foreground">
          {m.message}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {onApprove && (
          <button
            onClick={() => onApprove(m.id)}
            className="cursor-pointer rounded-lg bg-foreground/10 p-2 transition-colors hover:bg-foreground/20"
            title="Approve"
          >
            <Check className="h-3.5 w-3.5 text-foreground" />
          </button>
        )}
        <button
          onClick={() => onDelete(m.id)}
          className="cursor-pointer rounded-lg bg-red-500/10 p-2 transition-colors hover:bg-red-500/20"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </button>
      </div>
    </div>
  );
}
