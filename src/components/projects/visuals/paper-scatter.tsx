"use client";

import { useState } from "react";
import clsx from "clsx";

const W = 600;
const H = 300;
const PAD = { l: 44, r: 16, t: 14, b: 34 };

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

type Paper = { acc: number; size: number; score: number; constraints: boolean };

// 62 illustrative papers. Score = relative accuracy × relative (log) dataset
// size, as in the project's "paper-worthiness" metric. Constraint flags are
// set so the defaults (score > 80, all constraints) leave 15, as in the study.
function makePapers(): Paper[] {
  const r = seeded(11);
  const raw = Array.from({ length: 62 }, () => {
    const size = Math.round(10 ** (2.2 + r() * 2.8)); // ~160 to ~100k images
    const acc = 72 + r() * 26 + (Math.log10(size) - 3.5) * 2;
    return { acc: Math.min(99.2, acc), size };
  });
  const maxAcc = Math.max(...raw.map((p) => p.acc));
  const maxLog = Math.max(...raw.map((p) => Math.log10(p.size)));
  const base = raw.map((p) => (p.acc / maxAcc) * (Math.log10(p.size) / maxLog));
  // Scale so 22 papers clear 80, then fail 7 of those on constraints: 15 left.
  const ranked = [...base].sort((a, b) => b - a);
  const k = 80 / ((ranked[21] + ranked[22]) / 2);
  const scored = raw.map((p, i) => ({ ...p, score: Math.min(100, base[i] * k) }));
  const strong = [...scored].sort((a, b) => b.score - a.score).slice(0, 22);
  const keep = new Set(strong.filter((_, n) => ![1, 4, 8, 11, 15, 18, 20].includes(n)));
  return scored.map((p) => ({ ...p, constraints: keep.has(p) || (p.score <= 80 && r() > 0.5) }));
}
const PAPERS = makePapers();

const x = (size: number) => PAD.l + ((Math.log10(size) - 2) / 3.1) * (W - PAD.l - PAD.r);
const y = (acc: number) => PAD.t + (1 - (acc - 65) / 35) * (H - PAD.t - PAD.b);

/**
 * The literature review as a filter you can tune: drag the worthiness cutoff,
 * toggle the reproducibility constraints, and see how many papers survive.
 */
export function PaperScatter() {
  const [cut, setCut] = useState(80);
  const [strict, setStrict] = useState(true);
  const viable = PAPERS.filter((p) => p.score > cut && (!strict || p.constraints));

  return (
    <div className="grid gap-4 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="flex items-baseline gap-2 font-mono text-[13px] text-muted">
          viable papers <span className="text-[26px] tracking-[-0.02em] text-ink">{viable.length}</span> of {PAPERS.length}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
          <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} className="accent-[var(--color-blue)]" />
          Open source, public data, fits our GPUs
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${viable.length} of ${PAPERS.length} papers pass a worthiness score above ${cut}.`}>
        {[70, 80, 90, 100].map((a) => (
          <g key={a}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(a)} y2={y(a)} stroke="var(--color-line)" strokeDasharray="3 4" />
            <text x={PAD.l - 8} y={y(a) + 3} textAnchor="end" className="fill-[var(--color-faint)] font-mono text-[10px]">{a}%</text>
          </g>
        ))}
        {[100, 1000, 10000, 100000].map((s) => (
          <text key={s} x={x(s).toFixed(1)} y={H - 12} textAnchor="middle" className="fill-[var(--color-faint)] font-mono text-[10px]">
            {s >= 1000 ? `${s / 1000}k` : s} imgs
          </text>
        ))}
        {PAPERS.map((p, i) => {
          const pass = p.score > cut;
          const ok = pass && (!strict || p.constraints);
          return (
            <circle
              key={i}
              cx={x(p.size).toFixed(1)}
              cy={y(p.acc).toFixed(1)}
              r={ok ? 5.5 : 4}
              className={clsx("transition-all duration-300", ok ? "fill-[var(--color-blue)]" : pass ? "fill-[#c4c6be]" : "fill-[var(--color-line)]")}
              stroke={ok ? "#fff" : "none"}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      <label htmlFor="worthiness" className="flex items-center justify-between gap-3 text-[13.5px] text-ink-2">
        Worthiness cutoff (relative accuracy × dataset size)
        <span className="font-mono text-[13px] text-blue">&gt; {cut}</span>
      </label>
      <input id="worthiness" type="range" min={40} max={95} value={cut} onChange={(e) => setCut(Number(e.target.value))} className="scrubber w-full" />
      <p className="font-mono text-[11px] text-faint">Illustrative papers. The method and the 60+ → 15 outcome are from the study.</p>
    </div>
  );
}
