import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { MovingBorder } from "@/components/ui/moving-border";
import { education } from "@/lib/data";

/**
 * Two degrees, in cards that carry a travelling brand light around their edge —
 * the same treatment the featured project uses, at a slower pace so the two
 * sections do not compete.
 *
 * The border is drawn on a one-pixel outer element with the card floated on
 * top, rather than as an animated border on the card itself: an animated border
 * width would relayout its contents on every frame.
 */
export function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <BlurFade inView>
        <SectionHeading>Education</SectionHeading>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        {/* Full width and stacked, so each degree is one shallow row rather
            than a tall column — the content is four short lines and does not
            need depth. */}
        <div className="mt-10 flex flex-col gap-5">
          {education.map((entry, index) => (
            <div
              key={entry.school}
              className="relative overflow-hidden rounded-2xl p-px"
            >
              <div className="absolute inset-0">
                {/* Different durations, so the two are never lit at the same
                    point on their edge. */}
                <MovingBorder
                  duration={index === 0 ? 7000 : 8200}
                  rx="12%"
                  ry="12%"
                >
                  <div className="size-32 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-70" />
                </MovingBorder>
              </div>

              <div className="relative flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:px-8">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-brand">
                    {entry.period}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                    {entry.degree}
                  </h3>

                  <p className="mt-1.5 text-[15px] text-muted-foreground">
                    {entry.school} · {entry.location}
                  </p>
                </div>

                {/* Right-aligned and rule-separated on a wide card: the number
                    is the part worth a second look, and at this width it would
                    otherwise be lost against a long degree title. */}
                <div className="shrink-0 sm:border-l sm:border-border sm:pl-8 sm:text-right">
                  <p className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
                    {entry.gpa}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    GPA
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
