import clsx from "clsx";

const INK = "var(--color-ink)";

/**
 * A small me, drawn like an emoji: thick lines, a symmetrical curtain of
 * hair parted in the middle, thick glasses and eyes that blink now and then.
 */
export function Doodle({ className }: { className?: string }) {
  return (
    // viewBox is cropped to the drawing so the face sits flush with the page gutter.
    <svg viewBox="22 30 156 156" aria-hidden="true" className={clsx("overflow-visible", className)}>
      {/* Face */}
      <circle cx="100" cy="112" r="64" fill="#fff" stroke={INK} strokeWidth="12" />

      {/* Hair: one dark cap whose lower edge curves up to a centre parting */}
      <path d="M34 118A66 66 0 0 1 166 118C162 94 144 82 122 82 110 82 103 76 100 68 97 76 90 82 78 82 56 82 38 94 34 118Z" fill={INK} stroke={INK} strokeWidth="12" strokeLinejoin="round" />
      <path d="M56 76q10-14 28-18M144 76q-10-14-28-18" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="5" strokeLinecap="round" />

      {/* Glasses */}
      <g fill="#fff" stroke={INK} strokeWidth="9" strokeLinejoin="round">
        <rect x="55" y="102" width="40" height="30" rx="12" />
        <rect x="105" y="102" width="40" height="30" rx="12" />
      </g>
      <path d="M95 114q5-4 10 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />

      {/* Eyes */}
      <g fill={INK} className="animate-[doodle-blink_4.6s_ease-in-out_infinite]" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="75" cy="117" r="7" />
        <circle cx="125" cy="117" r="7" />
      </g>

      {/* Smile */}
      <path d="M89 151q11 9 22 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
