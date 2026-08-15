"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Briefcase,
  Download,
  FolderGit2,
  GraduationCap,
  Handshake,
  Mail,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";

/** Same order as the page, so this is a shortcut to the scroll, not a reshuffle. */
const NAV_ITEMS = [
  { label: "Go to About", id: "about", icon: User },
  { label: "Go to Experience", id: "experience", icon: Briefcase },
  { label: "Go to Projects", id: "projects", icon: FolderGit2 },
  { label: "Go to Education", id: "education", icon: GraduationCap },
  { label: "Go to Skills", id: "skills", icon: Sparkles },
  { label: "Go to Contact", id: "contact", icon: Mail },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-command-palette", handler);
    return () => window.removeEventListener("open-command-palette", handler);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    setTimeout(command, 150);
  };

  const goTo = (id: string) =>
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });

  const openLink = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => runCommand(() => goTo(item.id))}
            >
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            onSelect={() => runCommand(() => openLink(personal.github))}
          >
            <GithubIcon className="size-4" />
            Open GitHub
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => openLink(personal.linkedin))}
          >
            <LinkedinIcon className="size-4" />
            Open LinkedIn
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => openLink(personal.handshake))}
          >
            <Handshake className="size-4" />
            Open Handshake
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                const link = document.createElement("a");
                link.href = personal.resumeUrl;
                link.download = "";
                link.click();
              })
            }
          >
            <Download />
            Download Resume
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark"),
              )
            }
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
            Toggle theme
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => window.dispatchEvent(new Event("open-ai-chat")))
            }
          >
            <MessageCircle />
            Open AI Chat
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
