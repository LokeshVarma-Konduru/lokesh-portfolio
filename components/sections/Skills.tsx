import { Brain, Cloud, Database, Monitor, Server } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";
import { logoFor, type TechLogo } from "@/lib/tech-logos";
import { skills } from "@/lib/data";

const skillGroups = [
  {
    title: "Frontend",
    icon: Monitor,
    items: skills.frontend,
    span: "md:col-span-3",
  },
  {
    title: "AI & GenAI",
    icon: Brain,
    items: skills.ai,
    span: "md:col-span-3",
  },
  {
    title: "Backend",
    icon: Server,
    items: skills.backend,
    span: "md:col-span-2",
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    items: skills.cloud,
    span: "md:col-span-2",
  },
  {
    title: "Databases",
    icon: Database,
    items: skills.databases,
    span: "md:col-span-2",
  },
];

/**
 * Coloured marks render as-is. Brands whose logo is genuinely black or white are
 * drawn as a mask instead, so they take the current text colour rather than
 * disappearing into the background.
 */
function TechLogo({ logo, className = "" }: { logo: TechLogo; className?: string }) {
  if (logo.mono) {
    return (
      <span
        aria-hidden="true"
        className={`shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className}`}
        style={{ maskImage: `url(${logo.src})`, WebkitMaskImage: `url(${logo.src})` }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, nothing for next/image to optimise
    <img
      src={logo.src}
      alt=""
      aria-hidden="true"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

function SkillChip({ skill }: { skill: string }) {
  const logo = logoFor(skill);

  if (!logo) {
    return (
      <Badge variant="outline" className="border-brand/30 text-muted-foreground">
        {skill}
      </Badge>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-hover px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground">
      <TechLogo logo={logo} className="size-4" />
      {skill}
    </span>
  );
}

/** One entry per file, so the ticker never shows the same mark twice. */
const marqueeLogos = [
  ...new Map(
    Object.values(skills)
      .flat()
      .map((skill) => logoFor(skill))
      .filter((logo): logo is TechLogo => Boolean(logo))
      .map((logo) => [logo.src, logo])
  ).values(),
];

export function Skills() {
  return (
    // The one inverted band on the page. Every other section runs on the page
    // background with surface cards; here that flips, which breaks the run of
    // identical sections without costing the cards their contrast.
    <section
      id="skills"
      className="border-y border-border bg-surface py-28 md:py-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade inView>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Skills
          </span>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
            The stack I build with.
          </h2>
        </BlurFade>
      </div>

      {/* Full bleed: one edge-to-edge band stops the page reading as a single
          column of boxes. */}
      <BlurFade inView delay={0.2}>
        <div className="relative mt-14 flex w-full flex-col gap-4 overflow-hidden py-2">
          <Marquee pauseOnHover className="[--duration:60s] [--gap:3rem]">
            {marqueeLogos.map((logo) => (
              <TechLogo key={logo.src} logo={logo} className="size-9" />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:75s] [--gap:3rem]">
            {[...marqueeLogos].reverse().map((logo) => (
              <TechLogo key={logo.src} logo={logo} className="size-9" />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-surface" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-surface" />
        </div>
      </BlurFade>

      <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-6 md:grid-cols-6">
        {skillGroups.map((group, index) => (
          <BlurFade
            key={group.title}
            inView
            delay={0.1 * index}
            className={group.span}
          >
            <div className="flex h-full flex-col rounded-xl border border-border bg-background p-8">
              <group.icon className="size-6 text-brand" />
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                {group.title}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <SkillChip key={skill} skill={skill} />
                ))}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
