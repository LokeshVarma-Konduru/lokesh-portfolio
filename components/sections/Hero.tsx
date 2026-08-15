"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import {
  INNER_PLANETS,
  OrbitalHeroSection,
  SOLAR_SYSTEM,
} from "@/components/ui/orbital-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { useMediaQuery } from "@/lib/use-media-query";
import { personal } from "@/lib/data";

export function Hero() {
  // The canvas runs on the main thread, so phones get the four inner planets
  // and a thinner star field instead of all eight bodies with their full wakes.
  const compact = useMediaQuery("(max-width: 768px)");
  const nameWords = personal.name.split(" ");

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

          {/* The whole name, with only its initials at full size. The rest of
              each word runs small on the same baseline, so L V K reads out of
              the name rather than replacing it. */}
          <h1 className="flex flex-col gap-1 font-display leading-[0.9] text-white">
            {nameWords.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.2 + index * 0.14,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block whitespace-nowrap"
              >
                <span className="text-6xl sm:text-7xl lg:text-8xl">
                  {word[0]}
                </span>
                <span className="text-3xl text-white/85 sm:text-4xl lg:text-5xl">
                  {word.slice(1)}
                </span>
              </motion.span>
            ))}
          </h1>

          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-40 origin-left bg-gradient-to-r from-white/60 to-transparent"
          />

          {/* One title, held still. The rotating list moved to About, where
              there is room to read all four at once. */}
          <BlurFade delay={1}>
            <p className="font-display text-3xl italic leading-none text-brand md:text-4xl">
              {personal.role}
            </p>
          </BlurFade>

          {/* Status, not navigation. The buttons that were here duplicated the
              navbar and the contact section, and a jump-to-anything control in
              the hero invites skipping the page it sits on top of. Availability
              is the one thing a recruiter wants in the first five seconds and
              cannot get anywhere else on screen. */}
          <BlurFade delay={1.1}>
            <p className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-2 pl-3 pr-5 text-sm text-white/80 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {personal.seeking}
            </p>
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
