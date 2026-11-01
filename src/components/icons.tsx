import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

/** The Golden Gate, in its real International Orange. Cables draw in on mount. */
export function GoldenGateIcon({ animate = true, ...props }: IconProps & { animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 30 18"
      aria-hidden="true"
      className={animate ? "bridge-draw" : undefined}
      stroke="var(--color-bridge)"
      fill="none"
      strokeLinecap="round"
      {...props}
    >
      <path d="M1 12.5h28" strokeWidth={1.6} style={{ "--len": 30, "--d": "0.55s" } as React.CSSProperties} />
      <path d="M9 3v12M21 3v12" strokeWidth={1.8} style={{ "--len": 14, "--d": "0.65s" } as React.CSSProperties} />
      <path
        d="M1 8.5C5 7 8 5 9 3c3 6 9 6 12 0 1 2 4 4 8 5.5"
        strokeWidth={1.1}
        style={{ "--len": 40, "--d": "0.8s" } as React.CSSProperties}
      />
      <path
        d="M13 6.6v5.9M15 7.2v5.3M17 6.6v5.9M4.5 7.6v4.9M25.5 7.6v4.9"
        strokeWidth={0.8}
        style={{ "--len": 8, "--d": "1.05s" } as React.CSSProperties}
      />
    </svg>
  );
}

/** Three linked nodes: the site's signature mark (Rohan's "flower"). */
export function NodeMark({ accent = "var(--color-blue)", ...props }: IconProps & { accent?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" {...props}>
      <path d="M3 11 11 3M3 11h8M11 3v8" stroke="currentColor" strokeWidth={1} />
      <circle cx="3" cy="11" r="2" fill="currentColor" />
      <circle cx="11" cy="3" r="2" fill="currentColor" />
      <circle cx="11" cy="11" r="2.2" fill={accent} />
    </svg>
  );
}

/**
 * Doodle of Rohan, drawn from his photo: full wavy hair swept to one side,
 * thick rectangular glasses, round face, easy smile. The three-node mark sits
 * where Anushriya's flower does.
 */
