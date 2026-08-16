import { ArrowUpRight, FileText, Globe } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import type { projects } from "@/lib/data";

export type Project = (typeof projects)[number];

export function ProjectLinks({
  project,
  className = "mt-6",
}: {
  project: Project;
  className?: string;
}) {
  // A running deployment is the strongest thing a project card can offer, so it
  // is the filled button and it leads. The repository is the supporting act.
  const links = [
    project.live && {
      href: project.live,
      label: "Live Demo",
      Icon: Globe,
      primary: true,
    },
    project.github && {
      href: project.github,
      label: "Source",
      Icon: GithubIcon,
      primary: false,
    },
    "publication" in project &&
      project.publication && {
        href: project.publication,
        label: "Publication",
        Icon: FileText,
        primary: false,
      },
  ].filter(Boolean) as {
    href: string;
    label: string;
    Icon: typeof FileText;
    primary: boolean;
  }[];

  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map(({ href, label, Icon, primary }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            primary
              ? "group inline-flex items-center gap-2 rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-colors hover:brightness-110"
              : "group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
          }
        >
          <Icon className="size-4" />
          {label}
          {primary && (
            <ArrowUpRight
              aria-hidden="true"
              className="-ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </a>
      ))}
    </div>
  );
}

/** The address bar reads better as a bare host than a full URL. */
export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
