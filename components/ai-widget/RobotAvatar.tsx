"use client";

/**
 * The chat trigger's face.
 *
 * Depth here is layering and a little perspective, not geometry: the head tips
 * toward the pointer, the visor keeps a fixed highlight, and the eyes drift
 * within it. That reads as three-dimensional at 56 pixels for no bundle cost,
 * where an actual glTF robot would be roughly 180 KB of renderer plus a model.
 *
 * Everything that moves is gated on a fine pointer and on the visitor not
 * having asked for reduced motion.
 */

import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

/** Degrees the head turns at full pointer deflection. */
const TURN_Y = 16;
const TURN_X = 11;
/** SVG units the pupils travel, of a 48-unit viewBox. */
const GAZE_X = 2.4;
const GAZE_Y = 1.7;
/** Pointer distance, in pixels, at which the head is fully turned. */
const REACH = 480;

const SPRING = { damping: 18, stiffness: 220, mass: 0.6 };

export function RobotAvatar({
  className = "",
  /** True while the chat panel is open: the robot squints and the antenna lifts. */
  active = false,
}: {
  className?: string;
  active?: boolean;
}) {
  const gradientId = useId();
  const hostRef = useRef<HTMLSpanElement>(null);

  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const animated = finePointer && !reducedMotion;

  // -1..1 on each axis, relative to the robot's own centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, SPRING);
  const smoothY = useSpring(pointerY, SPRING);

  const rotateY = useTransform(smoothX, (v) => v * TURN_Y);
  const rotateX = useTransform(smoothY, (v) => -v * TURN_X);
  const gazeX = useTransform(smoothX, (v) => v * GAZE_X);
  const gazeY = useTransform(smoothY, (v) => v * GAZE_Y);

  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!animated) return;

    const onMove = (event: MouseEvent) => {
      const box = hostRef.current?.getBoundingClientRect();
      if (!box) return;
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      pointerX.set(Math.max(-1, Math.min(1, dx / REACH)));
      pointerY.set(Math.max(-1, Math.min(1, dy / REACH)));
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [animated, pointerX, pointerY]);

  // Irregular gaps: a blink on a fixed metronome looks like a loading spinner.
  useEffect(() => {
    if (!animated) return;

    let open: ReturnType<typeof setTimeout>;
    const schedule = () =>
      setTimeout(() => {
        setBlinking(true);
        open = setTimeout(() => {
          setBlinking(false);
          next = schedule();
        }, 130);
      }, 2600 + Math.random() * 3400);

    let next = schedule();
    return () => {
      clearTimeout(next);
      clearTimeout(open);
    };
  }, [animated]);

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      className={`relative inline-block size-11 shrink-0 ${className}`}
      style={{ perspective: "220px" }}
    >
      <motion.span
        className="block size-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={animated ? { y: [0, -1.8, 0] } : undefined}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 48 48" className="size-full overflow-visible">
          <defs>
            <linearGradient id={`${gradientId}-shell`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDFDFE" />
              <stop offset="52%" stopColor="#DCE1EA" />
              <stop offset="100%" stopColor="#A8B2C4" />
            </linearGradient>
            <linearGradient id={`${gradientId}-visor`} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#1B2436" />
              <stop offset="100%" stopColor="#070B14" />
            </linearGradient>
          </defs>

          {/* Antenna. The tip is the one brand-coloured thing above the visor. */}
          <line
            x1="24"
            y1="6.5"
            x2="24"
            y2="12.5"
            stroke="#8E99AC"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.circle
            cx="24"
            cy="5.4"
            r="2.5"
            fill="#3B82F6"
            animate={
              animated
                ? { opacity: active ? 1 : [0.55, 1, 0.55], r: active ? 3 : 2.5 }
                : undefined
            }
            transition={{ duration: 2, repeat: active ? 0 : Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 3px #3B82F6)" }}
          />

          {/* Ears, drawn before the head so the head's edge overlaps them. */}
          <rect x="4" y="21" width="4.5" height="9" rx="2.2" fill="#94A0B4" />
          <rect x="39.5" y="21" width="4.5" height="9" rx="2.2" fill="#7E8A9E" />

          <rect
            x="8"
            y="12.5"
            width="32"
            height="26"
            rx="9.5"
            fill={`url(#${gradientId}-shell)`}
          />
          {/* A single specular streak: what sells the shell as curved. */}
          <rect x="11" y="14.5" width="26" height="5" rx="2.5" fill="#FFFFFF" opacity="0.55" />

          <rect
            x="11.5"
            y="18"
            width="25"
            height="14.5"
            rx="7.2"
            fill={`url(#${gradientId}-visor)`}
          />

          <motion.g style={{ x: gazeX, y: gazeY }}>
            {active ? (
              // Squint: the robot is listening rather than staring.
              <>
                <rect x="17" y="24.4" width="5.4" height="1.8" rx="0.9" fill="#3B82F6" />
                <rect x="25.6" y="24.4" width="5.4" height="1.8" rx="0.9" fill="#3B82F6" />
              </>
            ) : (
              [18.4, 29.6].map((cx) => (
                <ellipse
                  key={cx}
                  cx={cx}
                  cy="25.3"
                  rx="2.5"
                  ry={blinking ? 0.35 : 2.9}
                  fill="#3B82F6"
                  style={{ filter: "drop-shadow(0 0 2.5px #60A5FA)" }}
                />
              ))
            )}
          </motion.g>

          {/* Chin vent: keeps the lower shell from reading as an empty slab. */}
          <rect x="20" y="35" width="8" height="1.4" rx="0.7" fill="#8E99AC" opacity="0.7" />
        </svg>
      </motion.span>
    </span>
  );
}
