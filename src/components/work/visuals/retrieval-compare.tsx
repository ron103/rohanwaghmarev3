"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import clsx from "clsx";

type Hit = { field: string; text: string; score: number; right?: boolean };

const NOTE = "Pt c/o chest pain radiating to L arm x2 days. Hx HTN, on lisinopril.";

// Illustrative results for one note. Mixing structured fields into the vector
// makes records from the same visit look alike, whatever they say.
const MODES = {
  mixed: {
    label: "All 8 fields in one vector",
    rank: 27,
    hits: [
      { field: "Follow-up", text: "HTN medication refill", score: 0.91 },
      { field: "Lab order", text: "Lipid panel", score: 0.89 },
      { field: "Chief complaint", text: "Headache, 3 days", score: 0.88 },
      { field: "Allergies", text: "Penicillin", score: 0.87 },
      { field: "Vitals", text: "BP 150/95", score: 0.86 },
    ] as Hit[],
  },
  split: {
    label: "Free text only, the rest as filters",
    rank: 1,
    hits: [
      { field: "Chief complaint", text: "Chest pain radiating to left arm", score: 0.86, right: true },
      { field: "HPI", text: "Substernal pressure on exertion", score: 0.81 },
      { field: "Assessment", text: "Rule out ACS", score: 0.77 },
      { field: "Vitals", text: "BP 150/95", score: 0.52 },
      { field: "Follow-up", text: "HTN medication refill", score: 0.48 },
    ] as Hit[],
  },
};
type Mode = keyof typeof MODES;

/** Same note, two ways of embedding the records. Watch where the right one lands. */
export function RetrievalCompare() {
  const [mode, setMode] = useState<Mode>("mixed");
  const m = MODES[mode];

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div role="tablist" aria-label="Embedding" className="flex w-fit flex-wrap rounded-[18px] bg-card p-1">
        {(Object.keys(MODES) as Mode[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={mode === k}
            onClick={() => setMode(k)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
              mode === k ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
            )}
          >
            {MODES[k].label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_200px] md:gap-8">
        <div className="grid min-w-0 content-start gap-3">
          <p className="rounded-[12px] bg-card px-4 py-3 text-[14px] leading-relaxed text-ink-2">
            <span className="mr-2 font-mono text-[11px] text-faint">note</span>
            {NOTE}
          </p>
          <ol className="grid gap-1.5">
            {m.hits.map((h, i) => (
              <li
                key={`${mode}-${h.field}-${h.text}`}
                className={clsx(
                  "grid animate-[fade-in_.35s_var(--ease-out-soft)_both] grid-cols-[22px_minmax(0,1fr)_88px] items-center gap-3 rounded-[10px] px-3 py-2 text-[13.5px]",
                  h.right ? "bg-blue-fill text-ink" : "bg-card/60 text-muted",
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="font-mono text-[11px] text-faint">#{i + 1}</span>
                <span className="min-w-0 truncate">
                  <span className="mr-1.5 font-medium text-ink-2">{h.field}</span>
                  {h.text}
                </span>
                <span className="flex items-center gap-2">
                  <i className="block h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                    <i className={clsx("block h-full rounded-full", h.right ? "bg-blue" : "bg-faint")} style={{ width: `${Math.round(h.score * 100)}%` }} />
                  </i>
                  <span className="font-mono text-[11px] tabular-nums">{h.score.toFixed(2)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid content-start gap-4">
          <div>
            <p className="font-mono text-[11px] text-faint">right record ranks</p>
            <p className={clsx("font-mono text-[44px] leading-none tracking-[-0.03em] transition-colors", m.rank <= 20 ? "text-blue" : "text-bridge")}>
              <NumberFlow value={m.rank} prefix="#" />
            </p>
            <p className="mt-1 text-[12.5px] text-muted">{m.rank <= 20 ? "inside the top 20" : "missed: outside the top 20"}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] text-faint">recall@20, across 48K records</p>
            <p className="font-mono text-[26px] leading-none tracking-[-0.02em] text-ink">
              <NumberFlow value={mode === "mixed" ? 61 : 88} suffix="%" />
            </p>
          </div>
        </div>
      </div>
      <p className="font-mono text-[11px] text-faint">The note and results are illustrative. Recall is the real measured number.</p>
    </div>
  );
}
