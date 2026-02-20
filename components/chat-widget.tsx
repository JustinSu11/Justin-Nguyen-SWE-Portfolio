"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const initialMessage: Message = {
  id: 0,
  role: "assistant",
  content:
    "Hey, I'm Justin. Ask me anything — my projects, my stack, how I think about building.",
};

const predefinedResponses: Record<string, string> = {
  project:
    "I've been working on some cool stuff! BeautyByAmy is a salon booking platform, Charles is an AI voice assistant, and this portfolio site. Each one taught me something different about building for real users.",
  stack:
    "My go-to stack is Next.js + TypeScript + Tailwind on the frontend, with Python/FastAPI for backend work. I also love working with AI APIs — Claude, Whisper, OpenRouter. PostgreSQL for data.",
  experience:
    "I'm a CS student with about 2 years of hands-on experience building web apps and AI tools. I'm self-taught in a lot of areas and always learning something new.",
  design:
    "I believe good design is invisible — it just works. I pay a lot of attention to details like animation timing, spacing, and typography. Tools like Figma and Framer Motion help me bridge design and code.",
  default:
    "Great question! I'm passionate about building thoughtful digital experiences. Feel free to ask about my projects, tech stack, or design philosophy — I love talking about this stuff.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("project") || lower.includes("work") || lower.includes("build"))
    return predefinedResponses.project;
  if (lower.includes("stack") || lower.includes("tech") || lower.includes("tool"))
    return predefinedResponses.stack;
  if (lower.includes("experience") || lower.includes("background") || lower.includes("student"))
    return predefinedResponses.experience;
  if (lower.includes("design") || lower.includes("style") || lower.includes("ui"))
    return predefinedResponses.design;
  return predefinedResponses.default;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getResponse(userMsg.content),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-panel mb-3 flex h-96 w-80 flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10">
                  <span className="font-[var(--font-display)] text-xs font-semibold text-foreground">
                    J
                  </span>
                </div>
                <span className="font-sans text-sm font-medium text-foreground">
                  Chat with Justin
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-sans text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl bg-secondary px-3.5 py-2.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent font-sans text-xs text-foreground placeholder:text-[#4a4540] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed pill */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="glass-pill group flex items-center gap-2.5 px-4 py-2.5 transition-all hover:shadow-[0_0_20px_rgba(245,240,232,0.08)]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 transition-all group-hover:ring-2 group-hover:ring-foreground/20">
            <span className="font-[var(--font-display)] text-xs font-semibold text-foreground">
              J
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Ask me anything
          </span>
        </motion.button>
      )}
    </div>
  );
}
