"use client";

import { useState } from "react";
import clsx from "clsx";

const W = 640;
const H = 240;
const PAD = { l: 36, r: 16, t: 16, b: 28 };
const WEEKS = 30;
const EVENTS = [7, 15, 23]; // weeks with real layoff news

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Illustrative series shaped like the project's findings: fear spikes a week
// or two before real events, then decays; "unemployed" mentions drift down.
const rand = seeded(3);
const fear = Array.from({ length: WEEKS }, (_, w) => {
  const bump = EVENTS.reduce((v, e) => {
    const d = w - (e - 1.5);
    return v + (d >= 0 ? 0.75 * Math.exp(-d / 1.6) : 0.75 * Math.exp(d * 1.4));
  }, 0);
  return 0.18 + bump + (rand() - 0.5) * 0.06;
});
const unemployed = Array.from({ length: WEEKS }, (_, w) => 0.72 - w * 0.016 + (rand() - 0.5) * 0.05);
const belief = Array.from({ length: WEEKS }, (_, w) => 0.25 + w * 0.022);

const x = (w: number) => PAD.l + (w / (WEEKS - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - Math.min(1, Math.max(0, v))) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, w) => `${w ? "L" : "M"}${x(w).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

/**
 * The team's assumption against what the sentiment pipeline showed. The shape
 * is illustrative (from the project write-up), not the raw data.
 */
export function SentimentChart() {
  const [view, setView] = useState<"belief" | "data">("data");

  return (
    <div className="grid gap-3 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <div role="tablist" aria-label="Chart view" className="flex w-fit rounded-full bg-card p-1">
        {(
          [
            ["belief", "What we believed"],
            ["data", "What the data showed"],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
              view === v ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={view === "data" ? "Fear spikes before layoff news and fades; unemployed mentions trend down." : "An assumed steady rise in fear as the market collapses."}>
        {[0, 0.5, 1].map((v) => (
          <line key={v} x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeDasharray={v ? "3 4" : undefined} />
        ))}
        <text x={PAD.l - 8} y={y(1) + 4} textAnchor="end" className="fill-[var(--color-faint)] font-mono text-[10px]">high</text>
        <text x={PAD.l - 8} y={y(0) + 4} textAnchor="end" className="fill-[var(--color-faint)] font-mono text-[10px]">low</text>
        {[0, 10, 20, 29].map((w) => (
          <text key={w} x={x(w)} y={H - 8} textAnchor="middle" className="fill-[var(--color-faint)] font-mono text-[10px]">
            wk {w + 1}
          </text>
        ))}

        {view === "data" &&
          EVENTS.map((e) => (
            <g key={e}>
              <line x1={x(e)} x2={x(e)} y1={PAD.t} y2={H - PAD.b} stroke="var(--color-bridge)" strokeDasharray="4 4" strokeOpacity="0.7" />
              <text x={x(e) + 4} y={PAD.t + 10} className="fill-[var(--color-bridge)] font-mono text-[10px]">layoff news</text>
            </g>
          ))}

        {view === "belief" ? (
          <path key="belief" d={path(belief)} fill="none" stroke="var(--color-ink-2)" strokeWidth="2.2" strokeDasharray="6 5" />
        ) : (
          <>
            <path key="unemp" d={path(unemployed)} fill="none" stroke="var(--color-faint)" strokeWidth="1.8" />
            <path key="fear" d={path(fear)} fill="none" stroke="var(--color-blue)" strokeWidth="2.4" />
          </>
        )}
      </svg>

      <ul className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11.5px] text-muted">
        {view === "data" ? (
          <>
            <li className="flex items-center gap-1.5"><i className="block h-[3px] w-4 rounded bg-blue" /> fear sentiment (weighted)</li>
            <li className="flex items-center gap-1.5"><i className="block h-[3px] w-4 rounded bg-faint" /> mentions of &ldquo;unemployed&rdquo;</li>
            <li className="flex items-center gap-1.5"><i className="block h-[3px] w-4 rounded bg-bridge" /> real layoff news</li>
          </>
        ) : (
          <li>the narrative: fear only rises as the market collapses</li>
        )}
        <li className="ml-auto text-faint">illustrative shape, not raw data</li>
      </ul>
    </div>
  );
}
