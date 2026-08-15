"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { experience } from "@/lib/data";

export function Experience() {
  const [selected, setSelected] = useState(0);
  const active = experience[selected];

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <BlurFade inView>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Experience
        </span>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Where I&apos;ve worked.
        </h2>
      </BlurFade>

      <BlurFade inView delay={0.2}>
        <div className="mt-14 grid gap-8 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-12">
          {/* Company rail. Horizontal and scrollable on narrow screens, a
              vertical list from md up. */}
          <div
            role="tablist"
            aria-label="Companies"
            aria-orientation="vertical"
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
          >
            {experience.map((exp, index) => {
              const isActive = index === selected;
              return (
                <button
                  key={exp.company}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setSelected(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors md:w-full",
                    isActive
                      ? "border-brand/40 bg-surface"
                      : "border-transparent hover:border-border hover:bg-surface/60"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="experience-marker"
                      className="absolute inset-y-2 -left-px hidden w-0.5 rounded-full bg-brand md:block"
                    />
                  )}
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-1.5">
                    <Image
                      src={exp.logo}
                      alt=""
                      width={exp.logoWidth}
                      height={exp.logoHeight}
                      sizes="80px"
                      className="h-full w-auto object-contain"
                    />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-sm font-semibold",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {exp.company}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {exp.period}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={active.company}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-80"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
                  {active.role}
                </h3>
                {active.note && (
                  <span className="rounded-full border border-brand/30 px-3 py-0.5 text-xs font-medium text-muted-foreground">
                    {active.note}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-brand">{active.company}</span>
                {" · "}
                {active.period} · {active.location}
              </p>

              <ul className="mt-7 space-y-4">
                {active.bullets.map((bullet) => (
                  <li
                    key={bullet.slice(0, 24)}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.article>
          </AnimatePresence>
        </div>
      </BlurFade>
    </section>
  );
}
