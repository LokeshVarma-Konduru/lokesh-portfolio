import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <BlurFade inView>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
          Experience
        </span>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Where I&apos;ve worked.
        </h2>
      </BlurFade>

      <TracingBeam className="mt-16 max-w-3xl md:mx-0">
        <div className="flex flex-col gap-8">
          {experience.map((exp, index) => (
            <BlurFade key={exp.company} inView delay={0.1 * index}>
              <article className="rounded-xl border border-border bg-surface p-8">
                <div className="mb-5 inline-flex items-center rounded-lg border border-border bg-white p-2">
                  <Image
                    src={exp.logo}
                    alt={exp.company}
                    width={exp.logoWidth}
                    height={exp.logoHeight}
                    sizes="200px"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                    {exp.role}
                  </h3>
                  {exp.note && (
                    <span className="rounded-full border border-brand/30 px-3 py-0.5 text-xs font-medium text-muted-foreground">
                      {exp.note}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-brand">{exp.company}</span>
                  {" · "}
                  {exp.period} · {exp.location}
                </p>

                <ul className="mt-5 space-y-2">
                  {exp.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 24)}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </BlurFade>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
}
