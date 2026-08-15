import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RobotAvatar } from "./RobotAvatar";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const BULLET = /^\s*[-•*]\s+/;
const ORDERED = /^\s*\d+[.)]\s+/;

/**
 * A deliberately small formatter rather than a markdown library.
 *
 * The system prompt asks for plain prose with at most simple lists, so the only
 * two shapes that ever arrive are bullets and numbered lines — about forty
 * lines of code, against roughly 30 KB for react-markdown and its remark
 * dependencies. It re-runs on every streamed chunk, so a list that is still
 * arriving renders as a list from its first item.
 */
function Inline({ text }: { text: string }) {
  // Bold is the one mark worth honouring if the model reaches for it anyway;
  // without this the asterisks would show up literally.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 ? (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Rich({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let ordered = false;

  const flushList = () => {
    if (!items.length) return;
    const List = ordered ? "ol" : "ul";
    blocks.push(
      <List
        key={blocks.length}
        className={cn(
          "my-1 space-y-1 pl-5",
          ordered ? "list-decimal" : "list-disc",
        )}
      >
        {items.map((item, index) => (
          <li key={index}>
            <Inline text={item} />
          </li>
        ))}
      </List>,
    );
    items = [];
  };

  for (const line of text.split("\n")) {
    const isBullet = BULLET.test(line);
    const isOrdered = ORDERED.test(line);

    if (isBullet || isOrdered) {
      // A list of a different kind starting mid-block closes the previous one.
      if (items.length && ordered !== isOrdered) flushList();
      ordered = isOrdered;
      items.push(line.replace(isOrdered ? ORDERED : BULLET, ""));
      continue;
    }

    flushList();
    if (line.trim()) {
      blocks.push(
        <p key={blocks.length}>
          <Inline text={line} />
        </p>,
      );
    }
  }

  flushList();
  return <>{blocks}</>;
}

export function ChatMessage({
  role,
  content,
  streaming = false,
}: Message & { streaming?: boolean }) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && <RobotAvatar className="mb-0.5 size-6" active />}
      <div
        className={cn(
          "max-w-[80%] space-y-2 rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isUser
            ? "whitespace-pre-wrap rounded-br-sm bg-brand text-white"
            : "rounded-bl-sm border border-border bg-surface-hover text-foreground",
        )}
      >
        {isUser ? <Inline text={content} /> : <Rich text={content} />}
        {streaming && (
          <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-brand align-middle" />
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <RobotAvatar className="mb-0.5 size-6" active />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-surface-hover px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
