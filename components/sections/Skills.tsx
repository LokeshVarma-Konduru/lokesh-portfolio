import { Brain, Cloud, Database, Monitor, Server } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
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

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28 md:py-44">
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

      <div className="mt-14 grid gap-5 md:grid-cols-6">
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
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-brand/30 text-muted-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
