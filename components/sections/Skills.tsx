import { Brain, Cloud, Database, Monitor, Server } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";
import { logoFor } from "@/lib/tech-logos";
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
 * The logo is a mask, not an image, so it inherits the current text colour and
 * shifts to the accent on hover along with the label.
 */
function TechLogo({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className}`}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
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
    <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand">
      <TechLogo src={logo} className="size-4" />
      {skill}
    </span>
  );
}

/** One logo per file, so the ticker never shows the same mark twice in a row. */
const marqueeLogos = [
  ...new Set(
    Object.values(skills)
      .flat()
      .map((skill) => logoFor(skill))
      .filter((logo): logo is string => Boolean(logo))
  ),
];

export function Skills() {
  return (
    <section id="skills" className="py-28 md:py-44">
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
              <TechLogo
                key={logo}
                src={logo}
                className="size-9 text-muted-foreground/60 transition-colors hover:text-brand"
              />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:75s] [--gap:3rem]">
            {[...marqueeLogos].reverse().map((logo) => (
              <TechLogo
                key={logo}
                src={logo}
                className="size-9 text-muted-foreground/60 transition-colors hover:text-brand"
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
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
            <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-8">
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
