"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { MovingBorder } from "@/components/ui/moving-border";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Safari } from "@/components/ui/safari";
import { Badge } from "@/components/ui/badge";
import { ProjectLinks, hostOf, type Project } from "./ProjectLinks";
import { ProjectWheel } from "./ProjectWheel";
import { ProjectCarousel } from "./ProjectCarousel";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

function ProjectCardContent({
  project,
  flipped,
}: {
  project: Project;
  flipped: boolean;
}) {
  return (
    <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-10">
      <div className={cn(flipped && "md:order-last")}>
        <Safari
          url={hostOf(project.live)}
          imageSrc={project.image}
          className="w-full drop-shadow-2xl"
        />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-heading text-sm font-bold text-brand">
            {project.id}
          </span>
          {project.note && (
            <span className="rounded-full border border-brand/30 px-3 py-0.5 text-xs font-medium text-muted-foreground">
              {project.note}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-2xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground md:text-3xl">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {project.client} · {project.period}
        </p>

        <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-brand/30 text-muted-foreground"
            >
              {tech}
            </Badge>
          ))}
        </div>

        <p className="mt-5 flex items-start gap-2 text-sm font-semibold text-foreground">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
          {project.metrics[0]}
        </p>

        <ProjectLinks project={project} />
      </div>
    </div>
  );
}

export function Projects() {
  // The ring's constraint is height, not width. The panel and the visible arc
  // have to share the viewport, which a phone can do at the compact size but
  // only above about 700px tall; a short window has room for one or the other.
  // So: the ring wherever it fits, the swipe carousel where it does not, and
  // the plain stack for anyone who asked for reduced motion — nothing pinned,
  // nothing snapping, no scroll-driven anything.
  const roomy = useMediaQuery("(min-width: 1024px)");
  const tallEnough = useMediaQuery("(min-height: 700px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Projects
        </h2>
      </BlurFade>

      {reducedMotion ? (
        <ProjectList />
      ) : roomy ? (
        <ProjectWheel />
      ) : tallEnough ? (
        <ProjectWheel compact />
      ) : (
        <ProjectCarousel />
      )}
    </section>
  );
}

function ProjectList() {
  return (
    <div className="mt-14 flex flex-col gap-10">
      {projects.map((project, index) => (
        <BlurFade key={project.id} inView delay={0.1 * (index + 1)}>
          {project.featured ? (
            // The featured project keeps the travelling border, so it reads as
            // the headline piece without every other card competing with it.
            <div className="relative overflow-hidden rounded-2xl p-px">
              <div className="absolute inset-0">
                <MovingBorder duration={5000} rx="10%" ry="10%">
                  <div className="size-40 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-80" />
                </MovingBorder>
              </div>
              <div className="relative rounded-2xl bg-surface">
                <ProjectCardContent
                  project={project}
                  flipped={index % 2 === 1}
                />
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl border border-border bg-surface">
              <GlowingEffect
                disabled={false}
                glow
                spread={40}
                proximity={80}
                borderWidth={2}
                inactiveZone={0.55}
              />
              <ProjectCardContent project={project} flipped={index % 2 === 1} />
            </div>
          )}
        </BlurFade>
      ))}
    </div>
  );
}
