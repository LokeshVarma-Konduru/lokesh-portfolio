"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import { SendHorizontal, Square, SquarePen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, TypingIndicator, type Message } from "./ChatMessage";
import { RobotAvatar } from "./RobotAvatar";
import { useMediaQuery } from "@/lib/use-media-query";

const SUGGESTED_QUESTIONS = [
  "What's Lokesh's backend experience?",
  "Has he worked with AWS or cloud infra?",
  "What projects has he shipped?",
  "What's his experience with AI/GenAI?",
];

/**
 * Two bubbles, two jobs. The first says the robot is there at all; it arrives
 * once the hero's own animation has finished so they are not competing. The
 * second waits until someone is actually reading the work, because that is when
 * they have a question worth asking.
 */
const GREETING = "Ask me anything";
const GREETING_SEEN_KEY = "chat-greeting-seen";
const GREETING_VISIBLE_MS = 4000;

const TEASER = "Ask me about the Kafka pipeline";
const TEASER_SEEN_KEY = "chat-teaser-seen";
const TEASER_VISIBLE_MS = 7000;

/** Roughly when the hero's name finishes animating in. */
const ENTRANCE_DELAY_MS = 1400;
/** Past this much scroll the visitor has moved on; skip the entrance. */
const ENTRANCE_SKIP_SCROLL = 600;

/** Gravity in, then two shrinking bounces — the shape of a dropped thing. */
const DROP: Transition = {
  duration: 1.15,
  times: [0, 0.42, 0.6, 0.76, 0.89, 1],
  ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
};

/** Within this much of the bottom, a new chunk keeps the view pinned there. */
const STICK_TO_BOTTOM_PX = 80;

type Bubble = { text: string; ask: boolean };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  /** null before it arrives; the pixels it falls from, or 0 for no drop. */
  const [entrance, setEntrance] = useState<number | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const wide = useMediaQuery("(min-width: 768px)");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** Only one bubble is ever up, so one timer retires whichever is showing. */
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const showBubble = useCallback((next: Bubble, ms: number) => {
    clearTimeout(bubbleTimer.current);
    setBubble(next);
    bubbleTimer.current = setTimeout(() => setBubble(null), ms);
  }, []);

  const openChat = useCallback(() => {
    clearTimeout(bubbleTimer.current);
    setBubble(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("open-ai-chat", openChat);
    return () => window.removeEventListener("open-ai-chat", openChat);
  }, [openChat]);

  // The robot drops in from above its own corner and bounces to a stop. It
  // falls down the right-hand margin rather than crossing the page, so it never
  // covers what is being read. Someone who has already scrolled gets it with no
  // drop at all, since a late arrival in a corner they passed looks broken.
  useEffect(() => {
    const late = window.scrollY > ENTRANCE_SKIP_SCROLL;
    const arrive = setTimeout(
      () => {
        setEntrance(late ? 0 : window.innerHeight + 140);
        if (late || sessionStorage.getItem(GREETING_SEEN_KEY)) return;
        sessionStorage.setItem(GREETING_SEEN_KEY, "1");
        showBubble({ text: GREETING, ask: false }, GREETING_VISIBLE_MS);
      },
      late ? 0 : ENTRANCE_DELAY_MS,
    );

    return () => clearTimeout(arrive);
  }, [showBubble]);

  // A prettier button moves the click rate a little; a prompt that arrives
  // when someone is already reading the work moves it a lot.
  useEffect(() => {
    if (sessionStorage.getItem(TEASER_SEEN_KEY)) return;

    const projects = document.querySelector("#projects");
    if (!projects) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        sessionStorage.setItem(TEASER_SEEN_KEY, "1");
        showBubble({ text: TEASER, ask: true }, TEASER_VISIBLE_MS);
      },
      { threshold: 0.2 },
    );

    observer.observe(projects);
    return () => observer.disconnect();
  }, [showBubble]);

  useEffect(() => () => clearTimeout(bubbleTimer.current), []);

  // Escape closes the panel and hands focus back to the button that opened it,
  // rather than dropping it at the top of the document.
  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Follow the answer as it streams, but only for someone who is at the bottom.
  // Scrolling up to re-read an earlier reply used to be undone by the next chunk.
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    const distance = box.scrollHeight - box.scrollTop - box.clientHeight;
    if (distance < STICK_TO_BOTTOM_PX) box.scrollTop = box.scrollHeight;
  }, [messages]);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setIsLoading(false);
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Append to the message already in state rather than to a running local
        // string: the transcript is the single source of truth for what has
        // arrived, and nothing outside React has to be kept in step with it.
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            role: "assistant",
            content: last.content + chunk,
          };
          return updated;
        });
      }
    } catch (error) {
      // A stop is not a failure: keep whatever had already arrived.
      if ((error as Error)?.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          };
          return updated;
        });
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.content === "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="false"
            aria-label="Ask about Lokesh"
            className="fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[70vh] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl md:bottom-36"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <RobotAvatar className="size-7" active />
                Ask about Lokesh
              </span>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={newChat}
                    aria-label="Start a new chat"
                    title="New chat"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                  >
                    <SquarePen className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Try asking:</p>
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => sendMessage(question)}
                      className="rounded-lg border border-border bg-surface-hover px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-brand/40"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* The placeholder the reply streams into is empty until the
                      first chunk; the typing indicator stands in for it, so it
                      is skipped rather than drawn as an empty bubble. */}
                  {messages.map((message, index) =>
                    message.content === "" ? null : (
                      <ChatMessage
                        key={index}
                        role={message.role}
                        content={message.content}
                        streaming={isLoading && index === messages.length - 1}
                      />
                    ),
                  )}
                  {showTypingIndicator && <TypingIndicator />}
                </>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
              />
              {/* While a reply is streaming the same slot stops it, rather than
                  leaving a disabled button and no way out of a long answer. */}
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => abortRef.current?.abort()}
                  className="shrink-0"
                  aria-label="Stop generating"
                >
                  <Square className="size-3.5 fill-current" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="shrink-0"
                  aria-label="Send message"
                >
                  <SendHorizontal className="size-4" />
                </Button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* `reducedMotion="user"` drops the transforms and keeps the fade for
          anyone who asked, and does it when the animation runs rather than at
          mount — so it is right on the first paint after hydration too. */}
      <MotionConfig reducedMotion="user">
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0 }}
          animate={
            entrance === null
              ? { opacity: 0 }
              : entrance === 0
                ? { opacity: 1, y: 0, rotate: 0 }
                : {
                    opacity: 1,
                    y: [-entrance, 0, -38, 0, -11, 0],
                    rotate: [-18, 0, 7, -4, 2, 0],
                  }
          }
          transition={entrance ? DROP : { duration: 0.2 }}
        >
          <AnimatePresence>
            {bubble && !open && (
              <motion.button
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => {
                  const { text, ask } = bubble;
                  openChat();
                  if (ask) sendMessage(text);
                }}
                className="max-w-56 rounded-xl rounded-br-sm border border-border bg-surface px-3 py-2 text-left text-sm text-foreground shadow-lg transition-colors hover:border-brand/40"
              >
                {bubble.text}
              </motion.button>
            )}
          </AnimatePresence>

          {/* No filled button behind it: a blue circle is the shape every
              support widget on the web already has, and the robot's own
              silhouette is the thing worth noticing. */}
          <button
            ref={triggerRef}
            onClick={() => (open ? setOpen(false) : openChat())}
            aria-expanded={open}
            aria-label={open ? "Close chat" : "Ask about Lokesh"}
            className="relative rounded-2xl outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
          >
            <RobotAvatar active={open} wave={entrance !== null} full={wide} />
            {bubble && !open && (
              <span className="absolute -right-0.5 -top-0.5 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex size-3 rounded-full border-2 border-background bg-brand" />
              </span>
            )}
          </button>
        </motion.div>
      </MotionConfig>
    </>
  );
}
