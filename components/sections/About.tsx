import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LinkedinIcon } from "@/components/icons";
import { personal, stats } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28 md:py-44">
      <div className="grid gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-3">
          <BlurFade inView>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              About
            </span>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
              I build systems that ship.
            </h2>
          </BlurFade>

          <BlurFade inView delay={0.2}>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {personal.about.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 20)}>{paragraph}</p>
              ))}
            </div>
          </BlurFade>

          <BlurFade inView delay={0.3}>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
            >
              <LinkedinIcon className="size-4" />
              Connect on LinkedIn
            </a>
          </BlurFade>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, index) => (
              <BlurFade key={stat.label} inView delay={0.1 * index}>
                <div className="rounded-xl border border-border bg-surface p-8">
                  <div className="whitespace-nowrap text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
                    <NumberTicker
                      value={stat.value}
                      decimalPlaces={stat.suffix.startsWith("/") ? 1 : 0}
                    />
                    {stat.suffix}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
