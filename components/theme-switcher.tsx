"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "warm",     label: "Warm Dark",    bg: "#0e0c0a", dot: "#f5f0e8" },
  { id: "navy",     label: "Midnight Navy", bg: "#080d14", dot: "#e8edf5" },
  { id: "forest",   label: "Forest Noir",  bg: "#070e09", dot: "#e4f0e8" },
  { id: "graphite", label: "Pure Graphite", bg: "#090909", dot: "#f2f2f2" },
  { id: "crimson",  label: "Deep Crimson", bg: "#0e0709", dot: "#f5eaec" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export function ThemeSwitcher() {
  const [active, setActive] = useState<ThemeId>("warm");

  useEffect(() => {
    const root = document.documentElement;
    if (active === "warm") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", active);
    }
  }, [active]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-xl">
      <span className="mb-1 text-center font-mono text-[0.6rem] tracking-widest text-white/30">
        THEME
      </span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          title={t.label}
          className="group relative flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ background: t.bg, border: `2px solid ${active === t.id ? t.dot : "transparent"}` }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: t.dot, opacity: active === t.id ? 1 : 0.4 }}
          />
          <span className="pointer-events-none absolute right-10 whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 font-mono text-[0.65rem] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}
