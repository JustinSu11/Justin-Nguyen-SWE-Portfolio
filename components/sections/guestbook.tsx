"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), message: message.trim() }),
    });

    setName("");
    setMessage("");
    setSubmitted(true);
  };

  return (
    <section id="guestbook" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block font-mono text-xs tracking-widest text-muted-foreground">
            {"// guestbook"}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-bold text-foreground">
            Leave a mark.
          </h2>
        </motion.div>

        {/* Input form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto mb-16 max-w-lg"
        >
          <form onSubmit={handleSubmit} className="glass-panel flex min-h-[212px] flex-col p-6">
            {submitted ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-center font-sans text-sm text-muted-foreground">
                  Thanks! Your message is pending review.
                </p>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4 w-full border-b border-border bg-transparent pb-3 font-sans text-sm text-foreground placeholder:text-[#4a4540] focus:border-foreground/20 focus:outline-none"
                />
                <textarea
                  placeholder="Leave a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="mb-4 w-full resize-none border-b border-border bg-transparent pb-3 font-sans text-sm text-foreground placeholder:text-[#4a4540] focus:border-foreground/20 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-foreground px-6 py-3 font-sans text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Sign the guestbook
                </button>
              </>
            )}
          </form>
        </motion.div>

        {/* Messages grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-panel mb-4 break-inside-avoid p-5"
              >
                <span className="mb-2 block font-mono text-xs text-muted-foreground">
                  {msg.name}
                </span>
                <p className="mb-3 font-sans text-sm font-light leading-relaxed text-foreground">
                  {msg.message}
                </p>
                <span className="font-mono text-[0.65rem] text-muted-foreground/50">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
