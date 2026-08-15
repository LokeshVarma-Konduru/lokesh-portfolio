/**
 * A miniature of the hero's solar system, for the chat trigger.
 *
 * Deliberately not the hero canvas: that runs a Kepler solve and a star field
 * every frame, which is a great deal of arithmetic for a button 28 pixels
 * across. Two rings tipped in 3D with a dot running round each gives the same
 * read for no script at all — the browser animates one transform per ring on
 * the compositor, and `motion-safe` drops it for anyone who asked for less
 * movement.
 */

type Ring = {
  /** Degrees the ring is tipped away from the viewer. */
  tilt: number;
  /** Degrees the ring is swung about the vertical, so the two do not coincide. */
  swing: number;
  duration: string;
  size: string;
  color: string;
};

const RINGS: Ring[] = [
  { tilt: 72, swing: 0, duration: "3.2s", size: "3px", color: "#93C5FD" },
  { tilt: 60, swing: 62, duration: "5.4s", size: "2.5px", color: "#FFFFFF" },
];

export function OrbitalAvatar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block size-7 shrink-0 ${className}`}
      style={{ perspective: "60px" }}
    >
      {/* The star: a hot core inside a soft halo. */}
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_2px_rgba(147,197,253,0.9)]" />

      {RINGS.map((ring) => (
        <span
          key={ring.swing}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${ring.swing}deg) rotateX(${ring.tilt}deg)`,
          }}
        >
          <span className="absolute inset-0 rounded-full border border-white/25" />
          <span
            className="absolute inset-0 motion-safe:animate-orbit"
            style={
              { "--orbit-duration": ring.duration } as React.CSSProperties
            }
          >
            <span
              className="absolute left-1/2 top-0 rounded-full"
              style={{
                width: ring.size,
                height: ring.size,
                background: ring.color,
                // Undoes the ring's tip so the planet stays a disc rather than
                // flattening into a line as it comes round the far side.
                transform: `translate(-50%, -50%) rotateX(${-ring.tilt}deg)`,
                boxShadow: `0 0 4px ${ring.color}`,
              }}
            />
          </span>
        </span>
      ))}
    </span>
  );
}
