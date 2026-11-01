import clsx from "clsx";

const INK = "var(--color-ink)";

/**
 * A small me: an oval face, full hair with the fringe sweeping right, thick
 * rectangular glasses, and eyes that blink now and then.
 */
export function Doodle({ className }: { className?: string }) {
  return (
    // viewBox is cropped to the drawing so the face sits flush with the page gutter.
    <svg viewBox="7.6 2 40.8 41.6" aria-hidden="true" className={clsx("overflow-visible", className)}>
      {/* Ears */}
      <g fill="#fff" stroke={INK} strokeWidth="1.5" strokeLinecap="round">
        <path d="M11.8 26.4c-2.4-.2-3 3.9-.3 4.6" />
        <path d="M36.2 26.4c2.4-.2 3 3.9.3 4.6" />
      </g>

      {/* Face, a little taller than wide */}
      <ellipse cx="24" cy="28.2" rx="12.4" ry="14.2" fill="#fff" stroke={INK} strokeWidth="1.8" />

      {/* Hair: full on top, fringe sweeping right */}
      <path
        d="M10.6 27.4C8.8 19.6 11.6 11.4 18.6 9.2c2.2-2.6 6.6-3.4 9.8-1.6 3.6-.4 7.2 1.8 8.6 5.4 2.4 3 2.4 8.4.6 13.4-.9-3.4-2.6-5.6-5-6.6-1.4 2.6-4.8 4-8.6 3.6 1.2-1.2 1.6-2.6 1.2-3.8-2.8 2.6-7.6 3.8-11.8 3.2-1.6 1.4-2.4 3-2.8 4.6z"
        fill={INK}
      />
      <path d="M17.2 10.6c-1.6-1.4-1.4-3.4.4-4.2M24.4 7.4c.2-1.8 1.8-2.8 3.6-2.2" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />

      {/* Glasses: thick, rectangular */}
      <g fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="13.6" y="24.8" width="8.8" height="6.4" rx="1.6" />
        <rect x="25.6" y="24.8" width="8.8" height="6.4" rx="1.6" />
      </g>
      <path d="M22.4 27.2h3.2" stroke={INK} strokeWidth="1.4" />

      {/* Eyes */}
      <g fill={INK} className="animate-[doodle-blink_4.6s_ease-in-out_infinite]" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="18" cy="28" r="1.2" />
        <circle cx="30" cy="28" r="1.2" />
      </g>

      {/* Smile */}
      <path d="M19.8 35.6c2.3 2.1 6.1 2.1 8.4 0" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
