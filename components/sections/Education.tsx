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
        {/* Capped below the section: two degree cards spread across 1280px
            would be 600px each for four short lines of text. */}
        <div className="mt-10 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
          {education.map((entry, index) => (
            <div
              key={entry.school}
              className="relative overflow-hidden rounded-2xl p-px"
            >
              <div className="absolute inset-0">
                {/* Offset so the two cards are never lit at the same point. */}
                <MovingBorder
                  duration={index === 0 ? 7000 : 8200}
                  rx="12%"
                  ry="12%"
                >
                  <div className="size-32 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-70" />
                </MovingBorder>
              </div>

              <div className="relative h-full rounded-2xl border border-border bg-surface p-7">
                <p className="font-heading text-sm font-semibold text-brand">
                  {entry.period}
                </p>

                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground">
                  {entry.degree}
                </h3>

                <p className="mt-1 text-[17px] text-foreground">
                  {entry.school}
                </p>

                <p className="mt-0.5 text-[15px] text-muted-foreground">
                  {entry.location}
                </p>

                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
                    {entry.gpa}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    GPA
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
