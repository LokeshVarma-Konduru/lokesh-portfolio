import { BlurFade } from "@/components/ui/blur-fade";
import { education, publications } from "@/lib/data";

/**
 * Deliberately the quietest section on the page.
 *
 * Experience is already a timeline with company marks, and repeating that shape
 * for two degrees would say they carry the same weight — they do not, for
 * someone with three years of shipping behind them. No cards either: the page
 * has plenty of bordered rectangles. Two accented columns, and the GPA gets the
 * only emphasis, since it is the part worth a second look.
 */
export function Education() {
  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Education
        </h2>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
          {education.map((entry) => (
            <div
              key={entry.school}
              className="border-l-2 border-brand/40 pl-5 md:pl-6"
            >
              <p className="font-heading text-sm font-semibold text-brand">
                {entry.period}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
                {entry.degree}
              </h3>

              <p className="mt-1 text-[15px] text-foreground">{entry.school}</p>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {entry.location}
              </p>

              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                  {entry.gpa}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  GPA
                </span>
              </p>
            </div>
          ))}
        </div>
      </BlurFade>

      {/* On the record, not promoted: small type, one rule above it, no heading
          large enough to compete with the degrees. */}
      <BlurFade inView delay={0.2}>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Publications
          </p>

          <ul className="mt-5 space-y-4">
            {publications.map((entry) => (
              <li key={entry.title} className="text-sm">
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition-colors hover:text-brand"
                >
                  {entry.title}
                </a>
                <p className="mt-1 text-muted-foreground">
                  {entry.venue} · {entry.year}
                  <span className="hidden sm:inline"> · {entry.detail}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </BlurFade>
    </section>
  );
}
