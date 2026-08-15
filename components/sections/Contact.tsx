"use client";

import { useState } from "react";
import {
  Check,
  Download,
  ExternalLink,
  FileText,
  Handshake,
  Mail,
  SendHorizontal,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${personal.email}`;
    }
  };

  /**
   * Composes the mail rather than posting it.
   *
   * Sending server-side would mean an email provider, an API key in the
   * deployment, and a spam-handling story for a public endpoint. Handing a
   * filled-in draft to the visitor's own mail client costs none of that, and it
   * leaves them a copy of what they sent — which a form post does not.
   */
  const compose = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = `Portfolio enquiry from ${form.name || "someone"}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}`;
    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const links = [
    {
      href: personal.linkedin,
      label: "LinkedIn",
      detail: "Connect",
      Icon: LinkedinIcon,
    },
    {
      href: personal.github,
      label: "GitHub",
      detail: "See the code",
      Icon: GithubIcon,
    },
    personal.handshake && {
      href: personal.handshake,
      label: "Handshake",
      detail: "University profile",
      Icon: Handshake,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    detail: string;
    Icon: typeof Handshake;
  }[];

  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pb-32 md:pt-24"
    >
      <BlurFade inView>
        <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-foreground md:text-6xl">
          Contact
        </h2>
        <p className="mt-5 max-w-md text-lg text-muted-foreground">
          {personal.seeking}
        </p>
      </BlurFade>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        <BlurFade inView delay={0.1}>
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <button
                type="button"
                onClick={copyEmail}
                className="mt-2 inline-flex items-center gap-2 text-lg text-brand transition-colors hover:text-brand-hover"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Mail className="size-4" />
                )}
                {copied ? "Copied to clipboard" : personal.email}
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Résumé</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {/* View and download are genuinely different intents: most
                    people want to read it now, some want the file. */}
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <FileText className="size-4" />
                  View
                </a>
                <a
                  href={personal.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <Download className="size-4" />
                  Download
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Elsewhere</p>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {links.map(({ href, label, detail, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-3 text-sm transition-colors hover:text-brand"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                      <span className="font-medium text-foreground transition-colors group-hover:text-brand">
                        {label}
                      </span>
                      <span className="text-muted-foreground">{detail}</span>
                      <ExternalLink className="ml-auto size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.2}>
          <form
            onSubmit={compose}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 md:p-8"
          >
            <p className="text-sm font-semibold text-foreground">
              Send me a message
            </p>

            <Input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your name"
              aria-label="Your name"
              required
            />
            <Input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Your email"
              aria-label="Your email"
              required
            />
            <Textarea
              value={form.message}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, message: event.target.value }))
              }
              placeholder="What would you like to talk about?"
              aria-label="Your message"
              rows={5}
              required
            />

            <ShimmerButton
              background="var(--brand)"
              borderRadius="0.625rem"
              className="text-sm font-medium"
            >
              <SendHorizontal className="mr-1.5 size-4" />
              Send message
            </ShimmerButton>

            <p className="text-xs text-muted-foreground">
              Opens your mail app with the message ready to send, so you keep a
              copy.
            </p>
          </form>
        </BlurFade>
      </div>
    </section>
  );
}
