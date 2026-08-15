import { ArrowUpRight, FileText } from "lucide-react";
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
    <div className={`flex flex-wrap items-center gap-5 ${className}`}>
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

/** The address bar reads better as a bare host than a full URL. */
export function hostOf(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
