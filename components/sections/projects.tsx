"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    name: "BeautyByAmy",
    description:
      "A modern salon booking platform with real-time scheduling, service management, and a clean client-facing experience.",
    tags: ["Next.js", "TypeScript", "Square", "Drizzle ORM"],
    year: "2026",
    link: "https://iibeautybyamyii.com",
    image: "/images/beautybyamy.png",
  },
  {
    name: "Charles",
    description:
      "An AI voice assistant that understands natural language, responds in real-time, and integrates with multiple LLM providers.",
    tags: ["Python", "FastAPI", "Whisper", "Electron"],
    year: "2026",
    link: "https://charles-swart-gamma.vercel.app",
    image: "/images/charles.png",
  },
  {
    name: "ClutchCall",
    description:
      "A full-stack sports analytics web app using AI/ML to surface the best players and teams across NBA, NFL, and soccer using real-time statistics.",
    tags: ["Python", "Flask", "React", "Next.js"],
    year: "2025",
    link: "https://github.com/JustinSu11/clutch-call",
    image: "/images/clutchcall.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-16"
        >
          <span className="mb-4 block font-mono text-xs tracking-widest text-muted-foreground">
            {"// projects"}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-bold text-foreground">
            Selected work.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={cardVariants}>
              <a
                href={project.link}
                target={project.link !== "#" ? "_blank" : undefined}
                rel={project.link !== "#" ? "noopener noreferrer" : undefined}
                className="glass-panel group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              >
                {/* Preview thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                  <img
                    src={project.image}
                    alt={`${project.name} preview`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(20,18,16,0.6)] to-transparent" />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 font-[var(--font-display)] text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 font-sans text-sm font-light leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {project.year}
                    </span>
                    <span className="flex items-center gap-1 font-sans text-sm text-foreground transition-colors group-hover:text-foreground/80">
                      Open{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
