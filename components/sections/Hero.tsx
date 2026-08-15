"use client";

import { ChevronDown, Command } from "lucide-react";
import { motion } from "motion/react";
import {
  INNER_PLANETS,
  OrbitalHeroSection,
  SOLAR_SYSTEM,
} from "@/components/ui/orbital-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { useMediaQuery } from "@/lib/use-media-query";
import { personal } from "@/lib/data";

export function Hero() {
  // The canvas runs on the main thread, so phones get the four inner planets
  // and a thinner star field instead of all eight bodies with their full wakes.
  const compact = useMediaQuery("(max-width: 768px)");
  const initials = personal.name.split(" ").map((word) => word[0]);

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

          {/* The monogram carries the size; the full name sits under it at a
              fraction of the weight. Each initial rises on its own, and the
              rule draws itself out from the left once they have landed. */}
          <h1 className="flex flex-col gap-4">
            <span className="flex gap-5 font-display text-7xl leading-none text-white sm:text-8xl lg:text-9xl">
              {initials.map((letter, index) => (
                <motion.span
                  key={letter}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.25 + index * 0.12,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.7,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-px w-40 origin-left bg-gradient-to-r from-white/60 to-transparent"
            />

            <TextAnimate
              as="span"
              by="character"
              animation="blurInUp"
              delay={0.75}
              duration={0.4}
              once
              className="block text-sm font-medium uppercase tracking-[0.42em] text-white/75 sm:text-base"
            >
              {personal.name}
            </TextAnimate>
          </h1>

          {/* One title, held still. The rotating list moved to About, where
              there is room to read all four at once. */}
          <BlurFade delay={1}>
            <p className="font-display text-3xl italic leading-none text-brand md:text-4xl">
              {personal.role}
            </p>
          </BlurFade>

          {/* Three buttons repeated links the navbar and the contact section
              already carry. This is the one thing the hero can offer that
              nothing else does: the command palette, which is otherwise a
              feature nobody discovers because it has no visible entry point. */}
          <BlurFade delay={1.15}>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("open-command-palette"))
              }
              className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-2 pl-2 pr-5 text-left backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <kbd className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-sans text-sm font-medium text-white">
                <Command className="size-3.5" />K
              </kbd>
              <span className="text-sm text-white/70 transition-colors group-hover:text-white">
                Jump to anything
              </span>
            </button>
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
