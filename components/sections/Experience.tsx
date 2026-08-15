"use client";

/**
 * Experience as a timeline.
 *
 * The company rail this replaces hid the one thing anyone reads this section
 * for: the dates. A period only appeared once you picked a tab, so the arc —
 * 2023 to 2026, the overlap, no gaps — was invisible unless you clicked through
 * every company. Here every role is on the page at once with its dates leading.
 *
 * The logos are not in the nodes. Virginia Tech's mark is 225x44 and MCCS's is
 * 962x290; contained in a circle those become about eleven pixels of unreadable
 * type surrounded by dead space. The node marks the position on the line, the
 * logo sits in the entry header where it has the width to be legible, and each
 * does the job it can actually do.
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { experience } from "@/lib/data";

/** Enough to show the shape of a role without turning the page into a résumé. */
const BULLETS_SHOWN = 3;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);

  // The line fills as the section is read. Ends at 55% so the last entry is
  // reached before the beam is, rather than the beam trailing behind the text.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28 md:py-36">
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Experience
        </h2>
      </BlurFade>

      <ol ref={listRef} className="relative mt-14">
        {/* The rail, and the brand-coloured length of it that has been read.
            Positioned on the centre line of the logo tiles. */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[27px] top-2 w-px bg-border md:left-[35px]"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: fill, originY: 0 }}
          className="absolute bottom-2 left-[27px] top-2 w-px bg-brand md:left-[35px]"
        />

        {/* BlurFade goes inside the item, not around it. Wrapping each <li> in
            a <div> put every item alone in its own parent, so `last:pb-0`
            matched all four and every entry lost its trailing gap — and a <div>
            is not a legal child of <ol> in the first place. */}
        {experience.map((role, index) => (
          <li
            key={role.company}
            className="relative pb-14 pl-20 last:pb-0 md:pb-16 md:pl-28"
          >
            {/* One tile size for every company, so the line reads as evenly
                marked. The marks themselves are wildly different shapes —
                225x44 through 200x200 — so each is contained inside the tile
                rather than filling it, and the white backing is there because
                they are dark-on-transparent and would vanish otherwise. */}
            <span className="absolute left-0 top-0 flex size-14 items-center justify-center rounded-xl border border-border bg-white ring-4 ring-background md:size-[72px]">
              <Image
                src={role.logo}
                alt={role.company}
                width={role.logoWidth}
                height={role.logoHeight}
                sizes="144px"
                className="max-h-[58%] max-w-[76%] object-contain"
              />
            </span>

            <BlurFade inView delay={0.05 * index}>
              <p className="font-heading text-sm font-semibold text-brand">
                {role.period}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {role.location}
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                {role.role}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-sm font-medium text-foreground">
                  {role.company}
                </p>
                {role.note && (
                  <span className="rounded-full border border-brand/30 px-3 py-0.5 text-xs text-muted-foreground">
                    {role.note}
                  </span>
                )}
              </div>

              <ul className="mt-5 space-y-3">
                {role.bullets.slice(0, BULLETS_SHOWN).map((bullet) => (
                  <li
                    key={bullet.slice(0, 24)}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-border" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </BlurFade>
          </li>
        ))}
      </ol>
    </section>
  );
}
