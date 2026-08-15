"use client";

import { ChevronDown, Download } from "lucide-react";
import { motion } from "motion/react";
import { Meteors } from "@/components/ui/meteors";
import { BlurFade } from "@/components/ui/blur-fade";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { personal } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent_28%,transparent_72%,white)]">
        <Meteors number={25} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7">
        <BlurFade delay={0.1}>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground md:text-sm">
            {personal.role}
          </span>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {personal.name.toUpperCase()}
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <WordRotate
            words={personal.taglines}
            className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl"
          />
        </BlurFade>

        <BlurFade delay={0.4}>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Building production-grade systems at Virginia Tech and beyond.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
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

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
