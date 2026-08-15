"use client";

/**
 * One heading for every section.
 *
 * They had drifted apart: About was text-5xl inside a column while the rest
 * were text-6xl at the top of their container, so no two sections announced
 * themselves the same way. This fixes the size and the treatment in one place.
 *
 * The rule is the whole decoration — a hairline that draws itself out of the
 * heading and fades, once, when the section is reached. It costs one transform
 * and it means the headings read as designed rather than as default type.
 */

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <h2 className="shrink-0 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-5xl">
        {children}
      </h2>

      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="h-px flex-1 origin-left bg-gradient-to-r from-brand via-brand/40 to-transparent"
      />
    </div>
  );
}
