import type { CSSProperties, ReactNode } from "react";

// Small still versions of each project's signature visual, for cards. They
// animate on hover of the nearest `group` (the card), with CSS only.

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Two captions that swap on hover: the resting state, then the result. */
function Caption({ rest, hover }: { rest: string; hover: string }) {
  const cls = "fill-[var(--color-muted)] font-mono text-[10px] transition-opacity duration-300";
  return (
    <>
      <text x="20" y="186" className={`${cls} group-hover:opacity-0`}>
        {rest}
      </text>
      <text x="20" y="186" className={`${cls} opacity-0 group-hover:opacity-100`}>
        {hover}
      </text>
    </>
  );
}

// Orchestrator: 191 tool dots, most of which drop out once the router runs.
const SERVICES = [86, 29, 25, 20, 20, 10, 1]; // GitHub, Calendar, Linear, Gmail, Drive, Slack, Perplexity
const KEEP = new Set([...Array.from({ length: 14 }, (_, i) => i), ...Array.from({ length: 20 }, (_, i) => 140 + i)]); // GitHub core + Gmail

function Tools() {
  let n = 0;
  const dots: ReactNode[] = [];
  SERVICES.forEach((count) => {
    for (let k = 0; k < count; k++, n++) {
      const col = n % 20;
      const row = Math.floor(n / 20);
      const keep = KEEP.has(n);
      dots.push(
        <circle
          key={n}
          cx={r1(44 + col * 12.4)}
          cy={r1(34 + row * 13.5)}
          r={3.6}
          className={
            keep
              ? "fill-[var(--color-blue)] opacity-40 transition-opacity duration-300 group-hover:opacity-100"
              : "fill-[var(--color-blue)] opacity-40 transition-opacity duration-300 group-hover:opacity-[0.08]"
          }
          style={{ transitionDelay: `${(n % 20) * 12}ms` }}
        />,
      );
    }
  });
  return (
    <>
      {dots}
      <Caption rest="191 tools in context" hover="router → 34 in context" />
    </>
  );
}

// Layoff tracker: fear spikes ahead of real layoff news.
const EVENTS = [7, 15, 23];
function series() {
  const rand = seeded(3);
  const fear = Array.from({ length: 30 }, (_, w) => {
    const bump = EVENTS.reduce((v, e) => {
      const d = w - (e - 1.5);
      return v + (d >= 0 ? 0.75 * Math.exp(-d / 1.6) : 0.75 * Math.exp(d * 1.4));
    }, 0);
    return 0.18 + bump + (rand() - 0.5) * 0.06;
  });
  const unemployed = Array.from({ length: 30 }, (_, w) => 0.72 - w * 0.016 + (rand() - 0.5) * 0.05);
  const x = (w: number) => 20 + (w / 29) * 280;
  const y = (v: number) => 30 + (1 - Math.min(1, v)) * 130;
  const d = (vals: number[]) => vals.map((v, w) => `${w ? "L" : "M"}${r1(x(w))},${r1(y(v))}`).join(" ");
  return { fear: d(fear), unemployed: d(unemployed), events: EVENTS.map((e) => r1(x(e))) };
}
const SENT = series();

function Sentiment() {
  return (
    <>
      {SENT.events.map((ex) => (
        <line key={ex} x1={ex} x2={ex} y1={26} y2={164} stroke="var(--color-bridge)" strokeOpacity="0.6" strokeDasharray="3 4" />
      ))}
      <path d={SENT.unemployed} fill="none" stroke="var(--color-faint)" strokeWidth="1.6" />
      <path
        d={SENT.fear}
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="2.2"
        pathLength={1}
        strokeDasharray="1"
        className="group-hover:animate-[poster-draw_1.4s_var(--ease-out-soft)_both]"
      />
      <Caption rest="fear vs. layoff news" hover="fear spikes first, then fades" />
    </>
  );
}

// Kalshi: the funnel from every open market to a few bets.
const FUNNEL = [
  { n: 600, label: "scanned" },
  { n: 30, label: "top volume" },
  { n: 10, label: "filtered" },
  { n: 10, label: "researched" },
  { n: 5, label: "bets" },
];
function Funnel() {
  return (
    <>
      {FUNNEL.map((f, i) => {
        const w = r1(Math.max(6, (Math.log10(f.n + 1) / Math.log10(601)) * 200));
        const y = 30 + i * 28;
        return (
          <g key={f.label}>
            <text x="58" y={y + 11} textAnchor="end" className="fill-[var(--color-ink)] font-mono text-[12px]">
              {f.n}
            </text>
            <rect
              x="68"
              y={y}
              width={w}
              height="14"
              rx="7"
              className={`origin-left [transform-box:fill-box] group-hover:animate-[span-grow_.7s_var(--ease-out-soft)_both] ${i === FUNNEL.length - 1 ? "fill-[var(--color-ok)]" : "fill-[var(--color-blue)] opacity-70"}`}
              style={{ animationDelay: `${i * 110}ms` } as CSSProperties}
            />
            <text x={68 + w + 8} y={y + 11} className="fill-[var(--color-faint)] font-mono text-[10px]">
              {f.label}
            </text>
          </g>
        );
      })}
      <Caption rest="one hourly run" hover="only bets at ≥65% confidence" />
    </>
  );
}

// Clockin: the watch's earnings ring.
function Watch() {
  return (
    <>
      <rect x="112" y="18" width="96" height="116" rx="30" fill="#1c1d22" stroke="#3a3b42" strokeWidth="2.5" />
      <rect x="208" y="52" width="5" height="22" rx="2" fill="#3a3b42" />
      <rect x="119" y="25" width="82" height="102" rx="24" fill="#000" />
      <g transform="rotate(-90 160 68)">
        <circle cx="160" cy="68" r="24" fill="none" stroke="#2c2d33" strokeWidth="7" />
        <circle
          cx="160"
          cy="68"
          r="24"
          fill="none"
          stroke="#30d158"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-out [stroke-dashoffset:0.62] group-hover:[stroke-dashoffset:0.12]"
        />
      </g>
      <text x="160" y="112" textAnchor="middle" className="fill-white font-mono text-[11px] transition-opacity duration-300 group-hover:opacity-0">
        $34.20
      </text>
      <text x="160" y="112" textAnchor="middle" className="fill-white font-mono text-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        $79.50
      </text>
      <Caption rest="earnings at $15/hr" hover="breaks don't count" />
    </>
  );
}

// TB: 62 papers, 15 worth reproducing.
function papers() {
  const rand = seeded(11);
  const pts = Array.from({ length: 62 }, () => ({ x: 30 + rand() * 260, y: 26 + rand() * 134 }));
  // "Worthy" = high on both axes (bigger data, higher accuracy).
  const ranked = [...pts].sort((a, b) => b.x - b.y - (a.x - a.y));
  const keep = new Set(ranked.slice(0, 15));
  return pts.map((p) => ({ x: r1(p.x), y: r1(p.y), keep: keep.has(p) }));
}
const PAPERS = papers();

function Scatter() {
  return (
    <>
      {PAPERS.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          className={
            p.keep
              ? "fill-[#c4c6be] transition-[fill] duration-300 group-hover:fill-[var(--color-blue)]"
              : "fill-[#c4c6be] transition-opacity duration-300 group-hover:opacity-30"
          }
          style={{ transitionDelay: `${(i % 10) * 18}ms` }}
        />
      ))}
      <Caption rest="60+ papers reviewed" hover="15 worth reproducing" />
    </>
  );
}

const POSTERS: Record<string, () => ReactNode> = {
  orchestrator: Tools,
  "layoff-tracker": Sentiment,
  "kalshi-agent": Funnel,
  clockin: Watch,
  "tb-detection": Scatter,
};

/** A project's signature visual in miniature. Hover the card to play it. */
export function ProjectPoster({ slug, className }: { slug: string; className?: string }) {
  const Art = POSTERS[slug];
  return (
    <div className={`grid place-items-center bg-white shadow-[inset_0_0_0_1px_var(--color-line)] ${className ?? ""}`}>
      <svg viewBox="0 0 320 200" className="h-full w-full max-w-[520px]" aria-hidden="true">
        {Art ? <Art /> : null}
      </svg>
    </div>
  );
}
