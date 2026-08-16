"use client";

/**
 * The chat trigger's face, and on a wide screen the rest of it.
 *
 * Depth here is layering and a little perspective, not geometry: the head tips
 * toward the pointer, the shell keeps a fixed specular streak, and the eyes
 * drift within the visor. That reads as three-dimensional for no bundle cost,
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
/** SVG units the pupils travel, of a 48-unit-wide head. */
const GAZE_X = 2.4;
const GAZE_Y = 1.7;
/** Pointer distance, in pixels, at which the head is fully turned. */
const REACH = 480;

const SPRING = { damping: 18, stiffness: 220, mass: 0.6 };

const SHELL_LIGHT = "#FDFDFE";
const SHELL_MID = "#DCE1EA";
const SHELL_DARK = "#A8B2C4";
const TRIM = "#8E99AC";
const BRAND = "#3B82F6";

export function RobotAvatar({
  className = "",
  /** True while the chat panel is open: the robot squints and the antenna lifts. */
  active = false,
  /** Flip to true once to play a single greeting tilt and arm wave. */
  wave = false,
  /** Draw the torso and arms as well as the head. */
  full = false,
}: {
  className?: string;
  active?: boolean;
  wave?: boolean;
  full?: boolean;
}) {
  const gradientId = useId();
  const hostRef = useRef<HTMLSpanElement>(null);

  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Only the gaze needs a pointer to follow. Breathing, blinking and the wave
  // are its own, and gating those on a mouse left the robot dead on a phone.
  const animated = !reducedMotion;
  const tracking = finePointer && animated;

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
    if (!tracking) return;

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
  }, [tracking, pointerX, pointerY]);

  // Irregular gaps: a blink on a fixed metronome looks like a loading spinner.
  useEffect(() => {
    if (!animated) return;

    let open: ReturnType<typeof setTimeout>;
    const schedule = () =>
      setTimeout(
        () => {
          setBlinking(true);
          open = setTimeout(() => {
            setBlinking(false);
            next = schedule();
          }, 130);
        },
        2600 + Math.random() * 3400,
      );

    let next = schedule();
    return () => {
      clearTimeout(next);
      clearTimeout(open);
    };
  }, [animated]);

  // The head keeps its own 48-unit coordinates in both layouts; the full body
  // just gives it a wider box to sit at the top of.
  const viewBox = full ? "0 0 64 78" : "0 0 48 48";
  const headShift = full ? "translate(8, 0)" : undefined;

  const head = (
    <g transform={headShift}>
      {/* Antenna. The tip is the one brand-coloured thing above the visor. */}
      <line
        x1="24"
        y1="6.5"
        x2="24"
        y2="12.5"
        stroke={TRIM}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <motion.circle
        cx="24"
        cy="5.4"
        r="2.5"
        fill={BRAND}
        // Both animated attributes need a starting value. Motion does not read
        // them back off an SVG node, so without this it writes r="undefined"
        // for a frame and the browser logs an error.
        initial={{ opacity: 1, r: 2.5 }}
        animate={
          animated
            ? { opacity: active ? 1 : [0.55, 1, 0.55], r: active ? 3 : 2.5 }
            : undefined
        }
        transition={{
          duration: 2,
          repeat: active ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{ filter: `drop-shadow(0 0 3px ${BRAND})` }}
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
      <rect
        x="11"
        y="14.5"
        width="26"
        height="5"
        rx="2.5"
        fill="#FFFFFF"
        opacity="0.55"
      />

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
            <rect
              x="17"
              y="24.4"
              width="5.4"
              height="1.8"
              rx="0.9"
              fill={BRAND}
            />
            <rect
              x="25.6"
              y="24.4"
              width="5.4"
              height="1.8"
              rx="0.9"
              fill={BRAND}
            />
          </>
        ) : (
          [18.4, 29.6].map((cx) => (
            <ellipse
              key={cx}
              cx={cx}
              cy="25.3"
              rx="2.5"
              ry={blinking ? 0.35 : 2.9}
              fill={BRAND}
              style={{ filter: "drop-shadow(0 0 2.5px #60A5FA)" }}
            />
          ))
        )}
      </motion.g>

      {!full && (
        // Standing in for the body that the wide layout draws instead.
        <rect
          x="20"
          y="35"
          width="8"
          height="1.4"
          rx="0.7"
          fill={TRIM}
          opacity="0.7"
        />
      )}
    </g>
  );

  const body = (
    <>
      {/* Arms first, so the torso edge overlaps the shoulders. */}
      <motion.rect
        x="9"
        y="45"
        width="5.5"
        height="16"
        rx="2.75"
        fill="#94A0B4"
        initial={false}
        animate={{ rotate: wave && animated ? [0, -38, -12, -32, 0] : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ transformBox: "view-box", transformOrigin: "11.75px 47px" }}
      />
      <rect x="49.5" y="45" width="5.5" height="16" rx="2.75" fill="#7E8A9E" />

      <rect x="30" y="38" width="4" height="5" rx="1.6" fill={TRIM} />
      <rect
        x="18"
        y="42"
        width="28"
        height="24"
        rx="8"
        fill={`url(#${gradientId}-shell)`}
      />
      <rect
        x="21"
        y="44"
        width="22"
        height="4"
        rx="2"
        fill="#FFFFFF"
        opacity="0.5"
      />
      {/* Chest lamp, on the same slow pulse as the antenna. */}
      <motion.circle
        cx="32"
        cy="56"
        r="3.2"
        fill={BRAND}
        initial={{ opacity: 1 }}
        animate={
          animated ? { opacity: active ? 1 : [0.4, 0.9, 0.4] } : undefined
        }
        transition={{
          duration: 2,
          repeat: active ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{ filter: `drop-shadow(0 0 4px ${BRAND})` }}
      />
      {/* No legs: it hovers, which is why the whole thing bobs. */}
      <rect x="25" y="68" width="14" height="3.5" rx="1.75" fill="#7E8A9E" />
      <ellipse cx="32" cy="74" rx="9" ry="1.6" fill={BRAND} opacity="0.22" />
    </>
  );

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      className={`relative inline-block shrink-0 ${full ? "aspect-[64/78] w-20" : "size-11"} ${className}`}
      style={{ perspective: "220px" }}
    >
      {/* Wave and float are separate elements so their transforms compose
          instead of one keyframe list having to describe both. */}
      <motion.span
        className="block size-full"
        initial={false}
        animate={{ rotate: wave && animated ? [0, -11, 7, 0] : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <motion.span
          className="block size-full"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          animate={animated ? { y: [0, -3, 0] } : undefined}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox={viewBox}
            className="size-full overflow-visible"
            // Without a filled button behind it, the shell needs its own
            // separation from the page — especially in the light theme.
            style={{ filter: "drop-shadow(0 4px 10px rgba(2, 6, 23, 0.28))" }}
          >
            <defs>
              <linearGradient
                id={`${gradientId}-shell`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={SHELL_LIGHT} />
                <stop offset="52%" stopColor={SHELL_MID} />
                <stop offset="100%" stopColor={SHELL_DARK} />
              </linearGradient>
              <linearGradient
                id={`${gradientId}-visor`}
                x1="0"
                y1="0"
                x2="0.4"
                y2="1"
              >
                <stop offset="0%" stopColor="#1B2436" />
                <stop offset="100%" stopColor="#070B14" />
              </linearGradient>
            </defs>

            {full && body}
            {head}
          </svg>
        </motion.span>
      </motion.span>
    </span>
  );
}
