import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LinkedinIcon } from "@/components/icons";
import { personal, stats } from "@/lib/data";

export function About() {
  return (
    // Banded. The tint has to run the full width of the window, so the section
    // carries the background and an inner wrapper holds the reading column.
    <section
      id="about"
      className="border-y border-border bg-surface py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-5 md:gap-16">
          <BlurFade inView className="md:col-span-2">
            {/* Capped and centred on a phone: at full width a 4:5 portrait is
              360x450, a whole screen of photograph before a word of text. */}
            <div className="relative mx-auto max-w-56 md:max-w-72">
              {/* Offset frame behind the portrait, so it reads as placed rather
                than as one more bordered box. */}
              <div className="absolute -bottom-4 -left-4 hidden size-full rounded-2xl border border-brand/25 md:block" />
              {/* The source is 402x469 — slightly wider than the 4:5 frame, so
                  cover trims the sides rather than the top of his head. */}
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border">
                <Image
                  src={personal.photo}
                  alt={personal.name}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              </div>
            </div>
          </BlurFade>

          <div className="md:col-span-3">
            <BlurFade inView>
              <SectionHeading>About me</SectionHeading>
            </BlurFade>

            {/* The hero used to cycle these one at a time. Here they can all be
                read at once, which is what a list of specialisms is for. */}
            <BlurFade inView delay={0.1}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {personal.taglines.map((tagline) => (
                  <li
                    key={tagline}
                    className="rounded-full border border-brand/30 px-3 py-1.5 text-[15px] text-muted-foreground"
                  >
                    {tagline}
                  </li>
                ))}
              </ul>
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
                className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand transition-colors hover:text-brand-hover"
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
                <dd className="mt-2 text-[15px] text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </BlurFade>
      </div>
    </section>
  );
}
