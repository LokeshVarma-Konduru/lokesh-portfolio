"use client";

import { useState } from "react";
import { Check, Download, Mail } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${personal.email}`;
    }
  };

  return (
    <section
      id="contact"
      className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 text-center md:pb-32 md:pt-24"
    >
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Contact
        </h2>
      </BlurFade>

      <BlurFade inView delay={0.2}>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          {personal.seeking}
        </p>
      </BlurFade>

      <BlurFade inView delay={0.3}>
        <ShimmerButton
          background="var(--brand)"
          borderRadius="0.625rem"
          className="mt-8 text-sm font-medium"
          onClick={copyEmail}
        >
          {copied ? (
            <>
              <Check className="mr-1.5 size-4" />
              Copied!
            </>
          ) : (
            <>
              <Mail className="mr-1.5 size-4" />
              {personal.email}
            </>
          )}
        </ShimmerButton>
      </BlurFade>

      <BlurFade inView delay={0.4}>
        <div className="mt-8 flex items-center gap-4">
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <LinkedinIcon className="size-5" />
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <GithubIcon className="size-5" />
          </a>
          <a
            href={personal.resumeUrl}
            download
            aria-label="Download Resume PDF"
            className="rounded-full border border-border p-3 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
          >
            <Download className="size-5" />
          </a>
        </div>
      </BlurFade>
    </section>
  );
}
