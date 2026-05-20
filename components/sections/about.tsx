"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "3+ Projects" },
  { label: "2 Years Experience" },
  { label: "CS Student" },
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:gap-16">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col md:w-3/5"
        >
          <span className="mb-4 font-mono text-xs tracking-widest text-muted-foreground">
            {"// about"}
          </span>
          <h2 className="mb-6 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-foreground">
            I build things
            <br />
            that matter.
          </h2>
          <p className="mb-8 max-w-lg font-sans text-sm font-light leading-relaxed text-muted-foreground">
            I&apos;m a software engineer and CS student passionate about
            creating elegant, user-focused digital experiences. I love working
            at the intersection of design and engineering, where beautiful
            interfaces meet clean, maintainable code. Whether it&apos;s a
            full-stack web app or an AI-powered tool, I approach every project
            with curiosity and attention to detail.
          </p>
          <div className="flex flex-wrap gap-3">
            {stats.map((stat) => (
              <span
                key={stat.label}
                className="glass-pill px-4 py-2 font-mono text-xs text-muted-foreground"
              >
                {stat.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex items-center justify-center md:w-2/5"
        >
          <div className="glass-panel relative flex h-72 w-full items-center justify-center overflow-hidden md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1916] to-[#0e0c0a] opacity-50" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-foreground/10">
                <span className="font-[var(--font-display)] text-4xl font-bold text-foreground">
                  JN
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Software Engineer
              </span>
            </div>
            {/* Soft inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_rgba(245,240,232,0.03)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
