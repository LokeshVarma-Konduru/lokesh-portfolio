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

/** Radius of the ring, in pixels. */
const RADIUS = 340;
/** Extra scroll, per project, that the section consumes while pinned. */
const SCROLL_PER_PROJECT = 320;
/**
 * Landscape, because the images are browser screenshots. Four cards on a 340px
 * ring sit 2·R·sin(45°) ≈ 481px apart, so 320 wide still leaves them clear of
 * each other.
 */
const CARD_W = 320;
const CARD_H = 200;

export function ProjectWheel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [scrolled, setScrolled] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);
  /** 1 while moving forward through the projects, -1 scrolling back up. */
  const [direction, setDirection] = useState(1);
  const lastSlice = useRef(0);

  // Scroll picks which card is at the top; it does not drive the angle directly.
  // Mapping rotation straight off progress meant the ring was only ever aligned
  // at the exact instants progress hit i/(n-1), so a card sat squarely at the
  // apex only if you scrolled to the pixel. Each project owns an equal slice of
  // the track instead, and the spring below walks the ring between the stops.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const slice = Math.min(
      count - 1,
      Math.floor(Math.max(0, Math.min(0.999, value)) * count),
    );
    if (slice === lastSlice.current) return;
    setDirection(slice > lastSlice.current ? 1 : -1);
    lastSlice.current = slice;
    setScrolled(slice);
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
      style={{ height: `calc(100vh + ${count * SCROLL_PER_PROJECT}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
        <Detail
          project={project}
          index={active}
          count={count}
          direction={direction}
        />

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

/** Degrees the heading tips through. A full 90 reads as a tumbling slab. */
const DRUM_TILT = 38;
const DRUM_LIFT = 26;

function Detail({
  project,
  index,
  count,
  direction,
}: {
  project: Project;
  index: number;
  count: number;
  direction: number;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-6 text-center">
      {/*
        The heading rides a drum, matching the ring below it. It rotates on X
        rather than Z: text foreshortens on the way through and lands flat and
        readable, where a Z rotation would put it upside down — the reason the
        rim cards counter-rotate.

        Only the heading. The body underneath is taller and holds the links, and
        a 350px slab tumbling on every change reads as heavy rather than
        mechanical; moving a click target on every scroll step is worse. Nothing
        below cross-fades.

        The children are absolutely placed so the outgoing and incoming lines
        overlap. With mode="wait" the panel would sit empty between them.
      */}
      <div
        className="relative min-h-[9.5rem]"
        style={{ perspective: "700px", transformStyle: "preserve-3d" }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={project.id}
            className="absolute inset-x-0 top-0"
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                opacity: 0,
                rotateX: -DRUM_TILT * dir,
                y: DRUM_LIFT * dir,
              }),
              center: { opacity: 1, rotateX: 0, y: 0 },
              exit: (dir: number) => ({
                opacity: 0,
                rotateX: DRUM_TILT * dir,
                y: -DRUM_LIFT * dir,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Keyed, so React swaps the body outright and it fades in. No exit
          animation: the links must not move while someone is reaching. */}
      <motion.div
        key={project.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
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
