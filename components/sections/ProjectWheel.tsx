"use client";

/**
 * The projects as a wheel: cards ride a large, half-buried circle that turns as
 * the section is scrolled, and whichever card reaches the top drives a detail
 * panel above it.
 *
 * Two decisions worth knowing about, both departures from the component this
 * was modelled on:
 *
 * The cards counter-rotate. The original baked a tangent rotation into each
 * item and spun the container, so every card was sideways or upside down for
 * most of the turn — fine for a photo with one word on it, useless for a
 * project title. Here the ring's rotation is negated on each card, so they
 * travel round the circle while staying upright.
 *
 * There is no GSAP. The original pulled in gsap, ScrollTrigger and @gsap/react,
 * about 95 KB gzipped, for a scrub tween and a pin. `motion` is already in the
 * bundle and gives the same scrub through `useScroll`, and `position: sticky`
 * pins better than ScrollTrigger does — no injected spacer elements, no
 * refresh() on resize.
 *
 * The rim carries an image and a title. Everything that has to be read or
 * clicked — description, tech, metric, links — lives in the static panel, which
 * is the only place a link can be both reachable and not spinning.
 */

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Badge } from "@/components/ui/badge";
import { ProjectLinks, type Project } from "./ProjectLinks";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

/** Radius of the ring, in pixels. */
const RADIUS = 330;
/** Extra scroll, per project, that the section consumes while pinned. */
const SCROLL_PER_PROJECT = 320;
const CARD_W = 176;
const CARD_H = 224;

export function ProjectWheel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // The ring stops with the last card at the top rather than completing the
  // circle, so no scroll is spent travelling back to the first.
  const span = (360 * (count - 1)) / count;
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, -span]), {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  const counterRotate = useTransform(rotate, (value) => -value);

  const [scrolled, setScrolled] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrolled(Math.round(Math.max(0, Math.min(1, value)) * (count - 1)));
  });

  // Pointing at a card wins over the scroll position, so someone can look
  // around the ring without having to scroll back and forth.
  const active = focused ?? scrolled;
  const project = projects[active];

  return (
    <div
      ref={trackRef}
      style={{ height: `calc(100vh + ${(count - 1) * SCROLL_PER_PROJECT}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
        <Detail project={project} index={active} count={count} />

        {/* The ring. Cropped at the bottom and faded out, so it reads as
            something larger than the viewport rather than a floating circle. */}
        <div
          className="relative mt-8 flex-1"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 62%, transparent 96%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 62%, transparent 96%)",
          }}
        >
          <motion.ul
            className="absolute left-1/2 m-0 list-none p-0"
            style={{
              width: RADIUS * 2,
              height: RADIUS * 2,
              top: CARD_H / 2,
              x: "-50%",
              rotate,
            }}
          >
            {projects.map((item, index) => {
              // Card 0 sits at the top of the circle; the rest follow clockwise.
              const angle = (index / count) * 2 * Math.PI;
              const x = RADIUS * Math.sin(angle);
              const y = -RADIUS * Math.cos(angle);

              return (
                <li
                  key={item.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`,
                  }}
                >
                  <motion.div style={{ rotate: counterRotate }}>
                    <RimCard
                      project={item}
                      isActive={index === active}
                      dimmed={focused !== null && focused !== index}
                      onFocus={() => setFocused(index)}
                      onBlur={() => setFocused(null)}
                    />
                  </motion.div>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}

function Detail({
  project,
  index,
  count,
}: {
  project: Project;
  index: number;
  count: number;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <p className="font-heading text-sm font-bold text-brand">
            {project.id}{" "}
            <span className="text-muted-foreground">
              / {String(count).padStart(2, "0")}
            </span>
          </p>

          <h3 className="mt-3 text-2xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground md:text-4xl">
            {project.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {project.client} · {project.period}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {project.tech.slice(0, 5).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="border-brand/30 text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="size-1.5 shrink-0 rounded-full bg-brand" />
            {project.metrics[0]}
          </p>

          <ProjectLinks project={project} className="mt-5 justify-center" />
        </motion.div>
      </AnimatePresence>

      {/* Fixed-height rail under the panel: a progress read-out that does not
          reflow when a longer title swaps in. */}
      <div className="mx-auto mt-8 flex w-40 gap-1.5" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i === index ? "bg-brand" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function RimCard({
  project,
  isActive,
  dimmed,
  onFocus,
  onBlur,
}: {
  project: Project;
  isActive: boolean;
  dimmed: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={project.title}
      style={{ width: CARD_W, height: CARD_H }}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-surface text-left shadow-lg outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-brand",
        isActive
          ? "-translate-y-3 scale-110 border-brand/50"
          : "scale-100 border-border",
        dimmed && "opacity-40 grayscale",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the placeholders
          are SVGs of a known size and this card never changes dimensions. */}
      <img
        src={project.image}
        alt=""
        className={cn(
          "absolute inset-0 size-full object-cover transition-transform duration-700 ease-out",
          isActive ? "scale-105" : "scale-100",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="font-heading text-[11px] font-bold text-brand">
          {project.id}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {project.title}
        </p>
        <span
          className={cn(
            "mt-2 block h-0.5 rounded-full bg-brand transition-all duration-500",
            isActive ? "w-full opacity-100" : "w-0 opacity-0",
          )}
        />
      </div>
    </button>
  );
}
