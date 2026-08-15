import { ArrowUpRight, FileText } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { MovingBorder } from "@/components/ui/moving-border";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Safari } from "@/components/ui/safari";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

type Project = (typeof projects)[number];

/** The address bar reads better as a bare host than a full URL. */
function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.github && {
      href: project.github,
      label: "GitHub",
      Icon: GithubIcon,
    },
    project.live && { href: project.live, label: "Live", Icon: ArrowUpRight },
    "publication" in project &&
      project.publication && {
        href: project.publication,
        label: "Publication",
        Icon: FileText,
      },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof FileText }[];

  if (links.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-5">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          <Icon className="size-4" />
          {label}
        </a>
      ))}
    </div>
  );
}

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
                  <ProjectCardContent project={project} flipped={index % 2 === 1} />
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
    </section>
  );
}
