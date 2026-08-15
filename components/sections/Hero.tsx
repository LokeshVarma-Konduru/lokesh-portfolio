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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0">
        <OrbitalHeroSection
          planets={compact ? INNER_PLANETS : SOLAR_SYSTEM}
          starCount={compact ? 500 : 1400}
          interactive={!compact}
          yearSeconds={18}
          glow={0.9}
          focus={[0.5, 0.54]}
          lead={0.14}
          scrim="bottom"
          scrimStrength={0.55}
          // A canvas fill needs a literal colour, and the hero stays dark in
          // both themes, so this is the site's dark background rather than a var.
          background="#0A0A0A"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7">
        <BlurFade delay={0.1}>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60 md:text-sm">
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
          className="max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {personal.name.toUpperCase()}
        </TextAnimate>

        <BlurFade delay={0.5}>
          <WordRotate
            words={personal.taglines}
            className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl"
          />
        </BlurFade>

        <BlurFade delay={0.6}>
          <p className="max-w-xl text-lg leading-relaxed text-white/70">
            Building production-grade systems at Virginia Tech and beyond.
          </p>
        </BlurFade>

        <BlurFade delay={0.7}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
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

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5 text-white/50" />
      </motion.div>
    </section>
  );
}
