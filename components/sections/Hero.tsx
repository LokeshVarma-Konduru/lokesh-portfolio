"use client";

import { ChevronDown, Download } from "lucide-react";
import { motion } from "motion/react";
import {
  INNER_PLANETS,
  OrbitalHeroSection,
  SOLAR_SYSTEM,
} from "@/components/ui/orbital-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { useMediaQuery } from "@/lib/use-media-query";
import { personal } from "@/lib/data";

export function Hero() {
  // The canvas runs on the main thread, so phones get the four inner planets
  // and a thinner star field instead of all eight bodies with their full wakes.
  const compact = useMediaQuery("(max-width: 768px)");
  const nameLines = personal.name.toUpperCase().split(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Full bleed behind everything: stars run the width of the hero, the
          spirals sit out to the right of the copy. */}
      <div className="absolute inset-0">
        <OrbitalHeroSection
          planets={compact ? INNER_PLANETS : SOLAR_SYSTEM}
          starCount={compact ? 500 : 1400}
          interactive={!compact}
          yearSeconds={18}
          focus={compact ? [0.5, 0.62] : [0.72, 0.5]}
          lead={0.12}
          scrim={compact ? "bottom" : "left"}
          scrimStrength={0.8}
          background="#0A0A0A"
        />
      </div>

      {/* The hero is dark in both themes, so its copy is set in white rather
          than the theme tokens. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Sitting a little below centre rather than on it: the greeting was
            riding high against the top of the canvas. */}
        <div className="flex max-w-xl flex-col gap-7 pt-16 md:pt-24">
          <BlurFade delay={0.1}>
            <span className="flex items-center gap-2 text-lg text-white/70 md:text-xl">
              <span
                aria-hidden="true"
                className="inline-block origin-[70%_80%] motion-safe:animate-wave"
              >
                👋
              </span>
              Hey, I&apos;m
            </span>
          </BlurFade>

          {/* One line per word. Splitting by character makes every letter its
              own inline-block, which lets a name wrap mid-word. */}
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {nameLines.map((word, index) => (
              <TextAnimate
                key={word}
                as="span"
                by="character"
                animation="blurInUp"
                delay={0.2 + index * 0.15}
                duration={0.5}
                once
                className="block whitespace-nowrap"
              >
                {word}
              </TextAnimate>
            ))}
          </h1>

          {/* One title, held still. The rotating list moved to About, where
              there is room to read all four at once. */}
          <BlurFade delay={0.7}>
            <p className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
              {personal.role}
            </p>
          </BlurFade>

          <BlurFade delay={0.9}>
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
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
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
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<a href={personal.resumeUrl} download />}
              >
                <Download className="size-4" />
                Resume PDF
              </Button>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Fades the canvas into whatever the next section's background is. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-background" />

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5 text-white/40" />
      </motion.div>
    </section>
  );
}
