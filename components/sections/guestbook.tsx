"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  date: string;
}

const initialMessages: GuestMessage[] = [
  {
    id: 1,
    name: "Alex Chen",
    message: "Incredible portfolio. The attention to detail is next level.",
    date: "Feb 2026",
  },
  {
    id: 2,
    name: "Sarah K.",
    message: "Love the design! Clean and elegant.",
    date: "Jan 2026",
  },
  {
    id: 3,
    name: "Dev Friend",
    message: "The globe animation is fire. Great work Justin!",
    date: "Jan 2026",
  },
  {
    id: 4,
    name: "Maya R.",
    message: "This is how portfolios should look. Bookmarked for inspiration.",
    date: "Dec 2025",
  },
];

export function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newMsg: GuestMessage = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };

    setMessages((prev) => [newMsg, ...prev]);
    setName("");
    setMessage("");
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
          <form onSubmit={handleSubmit} className="glass-panel p-6">
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
                  {msg.date}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
