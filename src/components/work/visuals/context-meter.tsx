"use client";

import { useState } from "react";
import clsx from "clsx";

// Real dataset sizes from the conversion of 279 trajectories.
const REAL = {
  16: { samples: "1,908", compactions: "1,630" },
  32: { samples: "660", compactions: "381" },
  64: { samples: "361", compactions: "82" },
} as const;
type Bound = keyof typeof REAL;

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// One illustrative run: assistant call + tool result pairs, in tokens.
const rand = seeded(7);
const PAIRS = Array.from({ length: 38 }, () => Math.round(1200 + rand() * 2800));
const TOTAL = PAIRS.reduce((a, b) => a + b, 0);
const SYSTEM = 1500;

type Sample = { summary: number; pairs: number[]; start: number };

/** Cut a run into samples under `bound` tokens without splitting a pair. */
function cut(bound: number) {
  const max = bound * 1024;
  const summary = Math.round(max * 0.12);
  const samples: Sample[] = [];
  let cur: Sample = { summary: 0, pairs: [], start: 0 };
  let used = SYSTEM;
  PAIRS.forEach((p, i) => {
    if (used + p > max) {
      samples.push(cur);
      cur = { summary, pairs: [], start: i };
      used = SYSTEM + summary;
    }
    cur.pairs.push(p);
    used += p;
  });
  samples.push(cur);
  return { samples, max };
}

const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(2)}%`;

/**
 * One long agent run cut to a context window. Each cut is a compaction: what
 * came before becomes a summary, and the next sample starts from it.
 */
export function ContextMeter() {
  const [bound, setBound] = useState<Bound>(16);
  const { samples, max } = cut(bound);
  const cuts = samples.slice(1).map((s) => PAIRS.slice(0, s.start).reduce((a, b) => a + b, 0));

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Context window" className="flex w-fit rounded-full bg-card p-1">
          {([16, 32, 64] as const).map((b) => (
            <button
              key={b}
              role="tab"
              aria-selected={bound === b}
              onClick={() => setBound(b)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 font-mono text-[13px] transition-[background-color,color] duration-200",
                bound === b ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
              )}
            >
              {b}K
            </button>
          ))}
        </div>
        <p className="font-mono text-[12.5px] text-muted">
          this run → <span className="text-ink">{samples.length}</span> samples, <span className="text-ink">{samples.length - 1}</span> compactions
        </p>
      </div>

      {/* The whole run, with a cut wherever the window fills up. */}
      <div className="grid gap-1.5">
        <p className="font-mono text-[11px] text-faint">one agent run · {Math.round(TOTAL / 1000)}K tokens</p>
        <div className="relative flex h-5 overflow-hidden rounded-[6px]">
          {PAIRS.map((p, i) => (
            <i key={i} className={clsx("block h-full", i % 2 ? "bg-blue/25" : "bg-blue/40")} style={{ width: pct(p, TOTAL) }} />
          ))}
          {cuts.map((c) => (
            <i key={c} className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-bridge" style={{ left: pct(c, TOTAL) }} />
          ))}
        </div>
      </div>

      {/* The samples it becomes, each against the window size. */}
      <ol className="grid gap-1.5">
        {samples.map((s, i) => {
          const used = SYSTEM + s.summary + s.pairs.reduce((a, b) => a + b, 0);
          return (
            <li key={`${bound}-${i}`} className="grid grid-cols-[70px_minmax(0,1fr)_64px] items-center gap-3 font-mono text-[11px] text-muted">
              <span>sample {i + 1}</span>
              <span className="relative flex h-3.5 overflow-hidden rounded-[4px] bg-card">
                <i className="block h-full bg-ink/15" style={{ width: pct(SYSTEM, max) }} />
                {s.summary > 0 && (
                  <i
                    className="block h-full bg-[repeating-linear-gradient(135deg,var(--color-bridge)_0_1.5px,transparent_1.5px_5px)] opacity-80"
                    style={{ width: pct(s.summary, max) }}
                  />
                )}
                {s.pairs.map((p, j) => (
                  <i key={j} className={clsx("block h-full", (s.start + j) % 2 ? "bg-blue/25" : "bg-blue/40")} style={{ width: pct(p, max) }} />
                ))}
              </span>
              <span className="text-right tabular-nums">
                {(used / 1024).toFixed(1)}K/{bound}K
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <i className="block h-2.5 w-4 rounded-[2px] bg-ink/15" /> system
        </span>
        <span className="flex items-center gap-1.5">
          <i className="block h-2.5 w-4 rounded-[2px] bg-[repeating-linear-gradient(135deg,var(--color-bridge)_0_1.5px,transparent_1.5px_5px)]" /> Kimi summary
        </span>
        <span className="flex items-center gap-1.5">
          <i className="block h-2.5 w-4 rounded-[2px] bg-blue/40" /> call + tool result, never split
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
        {([16, 32, 64] as const).map((b) => (
          <div key={b} className={clsx("rounded-[12px] px-3 py-2 transition-colors", b === bound ? "bg-blue-fill" : "bg-card/60")}>
            <dt className="font-mono text-[11px] text-faint">{b}K dataset</dt>
            <dd className="font-mono text-[15px] text-ink">{REAL[b].samples} samples</dd>
            <dd className="font-mono text-[11.5px] text-muted">{REAL[b].compactions} compactions</dd>
          </div>
        ))}
      </dl>
      <p className="font-mono text-[11px] text-faint">The run above is illustrative. The dataset totals are real, from 279 trajectories.</p>
    </div>
  );
}
