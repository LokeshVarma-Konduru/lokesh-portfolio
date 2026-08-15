"use client";

/**
 * The phone's answer to the wheel: one project per screen, swiped through.
 *
 * The ring does not shrink to this width. A card wide enough to show a 1200x700
 * screenshot needs a radius that would fill the viewport twice over, and the
 * hover that lets a desktop visitor look around the ring does not exist on
 * touch — the neighbouring cards become decoration you cannot reach. A snap
 * carousel keeps what the wheel is for, one project at a time and image-first,
 * on the gesture a phone already has.
 *
 * The scrolling itself is CSS scroll-snap, so it is native, momentum-correct
 * and free. The only JavaScript is an observer that keeps the dots in step.
 */

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProjectLinks, type Project } from "./ProjectLinks";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

export function ProjectCarousel() {
  const railRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Measured against the rail rather than the viewport, so this stays right
    // whatever the section's own scroll position is.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemsRef.current.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setActive(index);
        }
      },
      { root: rail, threshold: 0.6 },
    );

    for (const item of itemsRef.current) {
      if (item) observer.observe(item);
    }
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    itemsRef.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="mt-12">
      <ul
        ref={railRef}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            ref={(node) => {
              itemsRef.current[index] = node;
            }}
            className="w-[85vw] max-w-md shrink-0 snap-center"
          >
            <Card project={project} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.title}`}
            aria-current={index === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === active ? "w-6 bg-brand" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element -- placeholder SVGs
          of a known size, swapped for real screenshots later. */}
      <img
        src={project.image}
        alt=""
        className="aspect-16/10 w-full border-b border-border object-cover"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="font-heading text-sm font-bold text-brand">
            {project.id}
          </span>
          {project.note && (
            <span className="truncate rounded-full border border-brand/30 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {project.note}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl font-bold leading-tight tracking-[-0.02em] text-foreground">
          {project.title}
        </h3>

        <p className="mt-1.5 text-xs text-muted-foreground">
          {project.client} · {project.period}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-brand/30 text-xs text-muted-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Pushed to the bottom so cards of differing text length still line
            their metric and links up as you swipe past. */}
        <p className="mt-auto flex items-start gap-2 pt-4 text-sm font-semibold text-foreground">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
          {project.metrics[0]}
        </p>

        <ProjectLinks project={project} className="mt-4" />
      </div>
    </article>
  );
}
