"use client";

/**
 * The timeline's rail, as a curve rather than a straight drop.
 *
 * The line swings out and back between one company mark and the next, the way a
 * body swings around what it is orbiting, so the beam arrives at each logo
 * having travelled rather than fallen. The lobes alternate sides but not
 * symmetrically: there is only about 30px of clear space to the left of the
 * rail before the section's own padding, and roughly twice that to the right
 * before the text column starts, so the right-hand swings are the wide ones.
 *
 * Two things keep this cheap. `pathLength={1}` normalises the stroke dash units,
 * so the drawn portion is just `1 - progress` and nothing has to be measured to
 * animate it. And the head's position comes from `getPointAtLength` on scroll
 * rather than per-frame, which is a single transform update on two circles.
 */

import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";

export function TimelineRail({
  /** Vertical centre of each company mark, in pixels from the list's top. */
  nodes,
  height,
  railX,
  fill,
  reducedMotion,
}: {
  nodes: number[];
  height: number;
  railX: number;
  fill: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);
  const headX = useMotionValue(railX);
  const headY = useMotionValue(0);

  // Wider to the right, where the gap to the text column is; narrower to the
  // left, where the section's padding runs out.
  const wide = railX > 30;
  const swingRight = wide ? 52 : 30;
  const swingLeft = wide ? 26 : 15;

  const d = useMemo(() => {
    if (!height || nodes.length === 0) return "";

    const parts = [`M ${railX} 0`, `L ${railX} ${nodes[0]}`];

    for (let i = 0; i < nodes.length - 1; i += 1) {
      const from = nodes[i];
      const to = nodes[i + 1];
      const swing = i % 2 === 0 ? swingRight : -swingLeft;
      const ease = (to - from) * 0.28;
      parts.push(
        `C ${railX + swing} ${from + ease}, ${railX + swing} ${to - ease}, ${railX} ${to}`,
      );
    }

    parts.push(`L ${railX} ${height}`);
    return parts.join(" ");
  }, [height, nodes, railX, swingLeft, swingRight]);

  const drawn = useTransform(fill, (value) => 1 - value);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;

    lengthRef.current = path.getTotalLength();
    const point = path.getPointAtLength(lengthRef.current * fill.get());
    headX.set(point.x);
    headY.set(point.y);
  }, [d, fill, headX, headY]);

  useMotionValueEvent(fill, "change", (value) => {
    const path = pathRef.current;
    if (!path || !lengthRef.current) return;
    const point = path.getPointAtLength(lengthRef.current * value);
    headX.set(point.x);
    headY.set(point.y);
  });

  const headOpacity = useTransform(fill, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  if (!d) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 size-full overflow-visible"
    >
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1}
      />

      <motion.path
        d={d}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={1.5}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: reducedMotion ? 0 : drawn,
        }}
      />

      {!reducedMotion && (
        <motion.g style={{ x: headX, y: headY, opacity: headOpacity }}>
          <circle r={9} fill="var(--brand)" opacity={0.22} />
          <circle r={3.5} fill="var(--brand)" />
        </motion.g>
      )}
    </svg>
  );
}
