"use client";

import { motion } from "framer-motion";
import { WireframeGlobe } from "@/components/wireframe-globe";

const rows = [
  {
    label: "Frontend",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind",
      "shadcn/ui",
      "Framer Motion",
    ],
    direction: "left" as const,
    speed: "normal" as const,
  },
  {
    label: "Backend",
    skills: [
      "Node.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "REST APIs",
      "Docker",
    ],
    direction: "right" as const,
    speed: "normal" as const,
  },
  {
    label: "Tools / AI",
    skills: ["Claude API", "OpenRouter", "Whisper", "Git", "Vercel", "Figma"],
    direction: "left" as const,
    speed: "slow" as const,
  },
];

function SkillChip({ name }: { name: string }) {
  return (
    <span className="glass-pill mx-2 inline-flex shrink-0 items-center px-4 py-2 font-mono text-xs text-foreground/70">
      {name}
    </span>
  );
}

function ScrollRow({
  skills,
  direction,
  speed,
}: {
  skills: string[];
  direction: "left" | "right";
  speed: "normal" | "slow";
}) {
  const doubled = [...skills, ...skills];
  const animClass =
    direction === "left"
      ? speed === "slow"
        ? "animate-scroll-left-slow"
        : "animate-scroll-left"
      : "animate-scroll-right";

  return (
    <div className="carousel-fade-mask overflow-hidden">
      <div className={`flex w-max ${animClass}`}>
        {doubled.map((skill, i) => (
          <SkillChip key={`${skill}-${i}`} name={skill} />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-16"
        >
          <span className="mb-4 block font-mono text-xs tracking-widest text-muted-foreground">
            {"// skills"}
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-bold text-foreground">
            My toolkit.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="glass-panel overflow-hidden p-6 md:p-10"
        >
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            {/* Globe */}
            <div className="flex items-center justify-center md:w-1/2">
              <div className="h-[200px] w-[200px] md:h-[320px] md:w-[320px]">
                <WireframeGlobe />
              </div>
            </div>

            {/* Carousel */}
            <div className="flex flex-col justify-center gap-4 md:w-1/2">
              {rows.map((row) => (
                <ScrollRow
                  key={row.label}
                  skills={row.skills}
                  direction={row.direction}
                  speed={row.speed}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
