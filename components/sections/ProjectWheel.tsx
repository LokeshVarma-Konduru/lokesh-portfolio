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

import { useEffect, useRef, useState } from "react";
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

/**
 * Cards are landscape because the images are browser screenshots. Four of them
 * on a ring sit 2·R·sin(45°) apart — 481px on the wide ring, 283px on the
 * compact one — so in both cases the card width leaves them clear of each
 * other, even with the active one scaled up.
 *
 * The compact set is what makes a phone possible. Height is the real constraint
 * there, not width: the panel and the visible arc have to share about 700px, so
 * the ring drops to a 200px radius and the panel loses a tech chip and some
 * type size. Below that height Projects falls back to the swipe carousel.
 */
const SIZES = {
  wide: { radius: 340, cardW: 320, cardH: 200, scrollPer: 320 },
  compact: { radius: 200, cardW: 240, cardH: 150, scrollPer: 280 },
};

export function ProjectWheel({ compact = false }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = projects.length;
  const size = compact ? SIZES.compact : SIZES.wide;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [scrolled, setScrolled] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);

  // Scroll picks which card is at the top; it does not drive the angle directly.
  // Mapping rotation straight off progress meant the ring was only ever aligned
  // at the exact instants progress hit i/(n-1), so a card sat squarely at the
  // apex only if you scrolled to the pixel. Each project owns an equal slice of
  // the track instead, and the spring below walks the ring between the stops.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const slice = Math.floor(Math.max(0, Math.min(0.999, value)) * count);
    setScrolled(Math.min(count - 1, slice));
  });

  const rotate = useSpring(0, { stiffness: 120, damping: 24, mass: 0.5 });
  const counterRotate = useTransform(rotate, (value) => -value);

  useEffect(() => {
    rotate.set(-(scrolled * 360) / count);
  }, [count, rotate, scrolled]);

  // Pointing at a card wins over the scroll position, so someone can look
  // around the ring without having to scroll back and forth.
  const active = focused ?? scrolled;
  const project = projects[active];

  return (
    <div
      ref={trackRef}
      // One slice per project, not per gap: the last card used to reach the top
      // at the exact scroll position where the sticky panel unsticks, so it was
      // gone before it could be read. Its slice now holds it there.
      style={{ height: `calc(100vh + ${count * size.scrollPer}px)` }}
    >
      <div
        className={cn(
          "sticky top-0 flex h-screen flex-col overflow-hidden",
          compact ? "pt-20" : "pt-24",
        )}
      >
        <Detail
          project={project}
          index={active}
          count={count}
          compact={compact}
        />

        {/* The ring. Cropped at the bottom and faded out, so it reads as
            something larger than the viewport rather than a floating circle. */}
        <div
          className={cn("relative flex-1", compact ? "mt-5" : "mt-8")}
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
              width: size.radius * 2,
              height: size.radius * 2,
              top: size.cardH / 2,
              x: "-50%",
              rotate,
            }}
          >
            {projects.map((item, index) => {
              // Card 0 sits at the top of the circle; the rest follow clockwise.
              const angle = (index / count) * 2 * Math.PI;
              const x = size.radius * Math.sin(angle);
              const y = -size.radius * Math.cos(angle);

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
                      width={size.cardW}
                      height={size.cardH}
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
  compact,
}: {
  project: Project;
  index: number;
  count: number;
  compact: boolean;
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

          <h3
            className={cn(
              "mt-2 font-bold leading-[1.15] tracking-[-0.025em] text-foreground",
              compact ? "text-xl" : "mt-3 text-2xl md:text-4xl",
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "text-muted-foreground",
              compact ? "mt-1 text-xs" : "mt-2 text-sm",
            )}
          >
            {project.client} · {project.period}
          </p>

          <p
            className={cn(
              "mx-auto max-w-2xl leading-relaxed text-muted-foreground",
              compact ? "mt-3 line-clamp-3 text-sm" : "mt-4 text-[15px]",
            )}
          >
            {project.description}
          </p>

          <div
            className={cn(
              "flex flex-wrap justify-center gap-2",
              compact ? "mt-3" : "mt-5",
            )}
          >
            {project.tech.slice(0, compact ? 3 : 5).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="border-brand/30 text-muted-foreground"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <p
            className={cn(
              "inline-flex items-center gap-2 font-semibold text-foreground",
              compact ? "mt-3 text-xs" : "mt-5 text-sm",
            )}
          >
            <span className="size-1.5 shrink-0 rounded-full bg-brand" />
            {project.metrics[0]}
          </p>

          <ProjectLinks
            project={project}
            className={cn("justify-center", compact ? "mt-3" : "mt-5")}
          />
        </motion.div>
      </AnimatePresence>

      {/* Fixed-height rail under the panel: a progress read-out that does not
          reflow when a longer title swaps in. */}
      <div
        className={cn("mx-auto flex w-40 gap-1.5", compact ? "mt-5" : "mt-8")}
        aria-hidden="true"
      >
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
  width,
  height,
  isActive,
  dimmed,
  onFocus,
  onBlur,
}: {
  project: Project;
  width: number;
  height: number;
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
      style={{ width, height }}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-surface text-left shadow-lg outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-brand",
        isActive
          ? "-translate-y-3 scale-105 border-brand/50"
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
      {/* A landscape screenshot has more of itself worth showing, so the scrim
          covers the lower third rather than washing over the whole frame. */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 via-30% to-transparent to-60%" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-heading text-[11px] font-bold text-brand">
          {project.id}
        </p>
        <p className="mt-0.5 line-clamp-1 text-base font-semibold leading-tight text-foreground">
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
