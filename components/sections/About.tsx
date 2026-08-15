import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LinkedinIcon } from "@/components/icons";
import { personal, stats } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-5 md:gap-16">
        <BlurFade inView className="md:col-span-2">
          {/* Capped and centred on a phone: at full width a 4:5 portrait is
              360x450, a whole screen of photograph before a word of text. */}
          <div className="relative mx-auto max-w-56 md:max-w-none">
            {/* Offset frame behind the portrait, so it reads as placed rather
                than as one more bordered box. */}
            <div className="absolute -bottom-4 -left-4 hidden size-full rounded-2xl border border-brand/25 md:block" />
            {/* eslint-disable-next-line @next/next/no-img-element -- placeholder SVG, swapped for a real photo later */}
            <img
              src="/portrait-placeholder.svg"
              alt={personal.name}
              className="relative aspect-4/5 w-full rounded-2xl border border-border object-cover"
            />
          </div>
        </BlurFade>

        <div className="md:col-span-3">
          <BlurFade inView>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-5xl">
              About
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
      </div>

      {/* Numbers read as a headline row split by rules, rather than four more
          bordered cards on a page that already has plenty. */}
      <BlurFade inView delay={0.2}>
        <dl className="mt-14 grid grid-cols-2 gap-y-10 border-y border-border py-8 md:grid-cols-4 md:gap-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                index === 0
                  ? "px-2 md:px-8"
                  : "px-2 md:border-l md:border-border md:px-8"
              }
            >
              <dt className="whitespace-nowrap font-heading text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
                <NumberTicker
                  value={stat.value}
                  decimalPlaces={stat.suffix.startsWith("/") ? 1 : 0}
                />
                {stat.suffix}
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </BlurFade>
    </section>
  );
}
