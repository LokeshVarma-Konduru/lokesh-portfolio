"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { motion } from "motion/react";
import {
  INNER_PLANETS,
  OrbitalHeroSection,
  SOLAR_SYSTEM,
} from "@/components/ui/orbital-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { personal } from "@/lib/data";

/**
 * The canvas runs on the main thread, so phones get the four inner planets and
 * a thinner star field instead of all eight bodies with their full wakes.
 */
function useCompactScene() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return compact;
}

export function Hero() {
  const compact = useCompactScene();

  return (
    <section
      id="hero"
      className="grid min-h-screen grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[1fr_52%] md:grid-rows-1"
    >
      {/* Copy sits on the page, never over the canvas, so it keeps the theme
          tokens and stays readable in light mode. The left padding matches the
          max-w-6xl gutter every other section uses. */}
      <div className="relative z-10 flex flex-col justify-center gap-7 px-6 pb-10 pt-28 md:py-0 md:pl-[max(1.5rem,calc((100vw-72rem)/2))] md:pr-10">
        <BlurFade delay={0.1}>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground md:text-sm">
            {personal.role}
          </span>
        </BlurFade>

        <TextAnimate
          as="h1"
          by="character"
          animation="blurInUp"
          delay={0.2}
          duration={0.5}
          once
          className="text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          {personal.name.toUpperCase()}
        </TextAnimate>

        <BlurFade delay={0.5}>
          <WordRotate
            words={personal.taglines}
            className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl"
          />
        </BlurFade>

        <BlurFade delay={0.6}>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Building production-grade systems at Virginia Tech and beyond.
          </p>
        </BlurFade>

        <BlurFade delay={0.7}>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ShimmerButton
              background="var(--brand)"
              borderRadius="0.625rem"
              className="text-sm font-medium"
              onClick={() =>
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View My Work
              <ChevronDown className="ml-1.5 size-4" />
            </ShimmerButton>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <GithubIcon className="size-4" />
              GitHub
            </Button>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={personal.resumeUrl} download />}
            >
              <Download className="size-4" />
              Resume PDF
            </Button>
          </div>
        </BlurFade>
      </div>

      <div className="relative h-[46vh] md:h-auto">
        <OrbitalHeroSection
          planets={compact ? INNER_PLANETS : SOLAR_SYSTEM}
          starCount={compact ? 500 : 1400}
          interactive={!compact}
          yearSeconds={18}
          focus={[0.5, 0.5]}
          lead={0.12}
          background="#0A0A0A"
        />

        {/* Feathers the canvas into the page instead of butting up as a hard
            edge: down its left side on desktop, across its top on mobile. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-background md:block" />

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5 text-white/40" />
        </motion.div>
      </div>
    </section>
  );
}
