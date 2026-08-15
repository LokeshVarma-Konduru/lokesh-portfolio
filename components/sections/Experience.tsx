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

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TimelineRail } from "./TimelineRail";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { experience } from "@/lib/data";

/** Enough to show the shape of a role without turning the page into a résumé. */
const BULLETS_SHOWN = 3;

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [reached, setReached] = useState(-1);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

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
  // Percentage of the rail's own height, so the head needs no measuring and
  // stays correct when the entries reflow at a different width.
  // The rail is drawn from the marks' own positions, so it stays correct when
  // an entry's text reflows to a different height. ResizeObserver fires once on
  // observe, which is why there is no measuring pass in the effect body.
  const isMd = useMediaQuery("(min-width: 768px)");
  const [geometry, setGeometry] = useState<{ height: number; nodes: number[] }>(
    { height: 0, nodes: [] },
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const tileHalf = isMd ? 36 : 28;
    const observer = new ResizeObserver(() => {
      setGeometry({
        height: list.offsetHeight,
        nodes: itemsRef.current.flatMap((item) =>
          item ? [item.offsetTop + tileHalf] : [],
        ),
      });
    });

    observer.observe(list);
    return () => observer.disconnect();
  }, [isMd]);

  // Which tiles the beam has passed. It only ever grows: a node that has been
  // lit stays lit, so scrolling back up does not switch the section off again.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemsRef.current.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setReached((prev) => Math.max(prev, index));
        }
      },
      // Fires as the tile crosses the lower 60% mark, which is roughly where
      // the beam's head is by then.
      { rootMargin: "0px 0px -40% 0px" },
    );

    for (const item of itemsRef.current) {
      if (item) observer.observe(item);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Experience
        </h2>
      </BlurFade>

      <ol ref={listRef} className="relative mt-14">
        <TimelineRail
          nodes={geometry.nodes}
          height={geometry.height}
          railX={isMd ? 35 : 27}
          fill={fill}
          reducedMotion={reducedMotion}
        />

        {/* BlurFade goes inside the item, not around it. Wrapping each <li> in
            a <div> put every item alone in its own parent, so `last:pb-0`
            matched all four and every entry lost its trailing gap — and a <div>
            is not a legal child of <ol> in the first place. */}
        {experience.map((role, index) => {
          const roleLinks: { label: string; href: string }[] =
            ("links" in role && role.links) || [];

          return (
            <li
              key={role.company}
              ref={(node) => {
                itemsRef.current[index] = node;
              }}
              className="relative pb-14 pl-20 last:pb-0 md:pb-16 md:pl-28"
            >
              {/* One tile size for every company, so the line reads as evenly
                marked. The marks themselves are wildly different shapes —
                225x44 through 200x200 — so each is contained inside the tile
                rather than filling it, and the white backing is there because
                they are dark-on-transparent and would vanish otherwise. */}
              {/* The beam arriving: a dot swings once around the tile before the
                rail carries on. It sits below the tile in the stack, so it
                passes behind the mark on the far half of the turn — which is
                what makes it read as an orbit rather than a circling dot. */}
              {!reducedMotion && index === reached && (
                <motion.span
                  key={`orbit-${role.company}`}
                  aria-hidden="true"
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, times: [0, 0.15, 0.7, 1] }}
                  className="pointer-events-none absolute left-0 top-0 z-0 flex size-14 items-center justify-center md:size-[72px]"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative size-[138%]"
                  >
                    <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_10px_3px_rgba(59,130,246,0.6)]" />
                  </motion.span>
                </motion.span>
              )}

              {/* The node lights as the beam reaches it, which is what makes the
                rail read as causal rather than decorative — and marks how far
                through the section you are. */}
              <span
                className={cn(
                  "absolute left-0 top-0 z-10 flex size-14 items-center justify-center rounded-xl border bg-white ring-4 ring-background transition-[border-color,box-shadow] duration-500 md:size-[72px]",
                  index <= reached
                    ? "border-brand shadow-[0_0_18px_-2px_rgba(59,130,246,0.65)]"
                    : "border-border",
                )}
              >
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
                {/* Role, then company, then the when and where. The dates led
                  before, in brand colour and a heading face, which made the
                  loudest thing on every entry the least interesting: what he
                  did and who for should be read first. They are still directly
                  under the title — visible without being the headline. */}
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                  {role.role}
                </h3>

                <p className="mt-1 font-heading text-lg font-semibold text-brand">
                  {role.company}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-muted-foreground">
                  <span>
                    {role.period} · {role.location}
                  </span>
                  {role.note && (
                    <span className="rounded-full border border-border px-3 py-0.5 text-xs">
                      {role.note}
                    </span>
                  )}
                </div>

                <ul className="mt-5 space-y-3">
                  {role.bullets.slice(0, BULLETS_SHOWN).map((bullet) => (
                    <li
                      key={bullet.slice(0, 24)}
                      className="flex items-start gap-3 text-[17px] leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-border" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Only some roles carry references, so this is read through a
                  guard rather than indexed straight off the union. */}
                {roleLinks.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {roleLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
                      >
                        {link.label}
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    ))}
                  </div>
                )}
              </BlurFade>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
