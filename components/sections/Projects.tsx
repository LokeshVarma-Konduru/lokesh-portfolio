import { ArrowUpRight, FileText } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MovingBorder } from "@/components/ui/moving-border";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons";
import { projects } from "@/lib/data";

function ProjectCardContent({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="flex flex-col p-8 md:p-10">
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

      <h3 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground md:text-4xl">
        {project.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {project.client} · {project.period}
      </p>

      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.slice(0, 6).map((tech) => (
          <Badge
            key={tech}
            variant="outline"
            className="border-brand/30 text-muted-foreground"
          >
            {tech}
          </Badge>
        ))}
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {project.metrics.map((metric) => (
          <li
            key={metric}
            className="flex items-start gap-2 text-sm font-semibold text-foreground"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
            {metric}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
        ) : null}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            <ArrowUpRight className="size-4" />
            Live
          </a>
        ) : null}
        {"publication" in project && project.publication ? (
          <a
            href={project.publication}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            <FileText className="size-4" />
            Publication
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28 md:py-44">
      <BlurFade inView>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Projects
        </span>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Featured Work
        </h2>
      </BlurFade>

      <div className="mt-14 flex flex-col gap-10">
        {projects.map((project, index) => (
          <BlurFade key={project.id} inView delay={0.15 * (index + 1)}>
            <div className="relative overflow-hidden rounded-2xl p-px">
              <div className="absolute inset-0">
                <MovingBorder duration={5000} rx="10%" ry="10%">
                  <div className="size-40 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-80" />
                </MovingBorder>
              </div>
              <div className="relative rounded-2xl bg-surface">
                <ProjectCardContent project={project} />
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
