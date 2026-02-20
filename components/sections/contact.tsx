"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:py-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="mb-4 block font-mono text-xs tracking-widest text-muted-foreground">
          {"// contact"}
        </span>
        <h2 className="mb-6 font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-bold text-foreground">
          {"Let's build something."}
        </h2>
        <p className="mb-10 font-sans text-sm font-light text-muted-foreground">
          {"Got a project in mind, or just want to say hello? I'm always open to new conversations and collaborations."}
        </p>

        <a
          href="mailto:justin@example.com"
          className="mb-10 inline-block font-[var(--font-display)] text-xl font-semibold text-foreground transition-opacity hover:opacity-70 md:text-2xl"
        >
          justin@example.com
        </a>

        <div className="flex items-center justify-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill flex items-center gap-2 px-5 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill flex items-center gap-2 px-5 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mx-auto mt-32 max-w-6xl border-t border-border pt-8 text-center">
        <p className="font-mono text-xs text-muted-foreground/50">
          {"Designed & built by Justin Nguyen"} &middot; {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
