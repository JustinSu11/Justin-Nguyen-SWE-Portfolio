"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export function Hero() {
  return (
    <section
      id="hero"
      className="hero-gradient relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="grain-overlay" />
      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 font-mono text-xs tracking-widest text-muted-foreground"
        >
          {"[ Software Engineer ]"}
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 font-[var(--font-display)] text-[clamp(3rem,8vw,7rem)] font-bold leading-[1.05] tracking-tight text-foreground"
        >
          Justin Nguyen
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 max-w-lg font-sans text-base font-light text-muted-foreground"
        >
          Crafting thoughtful digital experiences with clean code and creative
          problem-solving.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex gap-4"
        >
          <a
            href="#projects"
            className="rounded-full border border-foreground/20 px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/40 hover:bg-foreground/5"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-foreground/20 px-6 py-3 font-sans text-sm font-medium text-foreground transition-colors duration-200 hover:border-foreground/40 hover:bg-foreground/5"
          >
            Say Hello
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="animate-bounce-subtle h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
