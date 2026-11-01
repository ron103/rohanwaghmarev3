"use client";

import { useState } from "react";
import clsx from "clsx";

const TOKENS = 63_263; // longest sample actually trained
const GPUS = 8;
const PER = Math.ceil(TOKENS / GPUS);

/**
 * One 63K-token sample on one GPU versus split eight ways. Memory fills are
 * illustrative; the hardware and the sequence length are real.
 */
export function SeqParallel() {
  const [sp, setSp] = useState(true);

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Parallelism" className="flex w-fit rounded-full bg-card p-1">
          {[false, true].map((on) => (
            <button
              key={String(on)}
              role="tab"
              aria-selected={sp === on}
              onClick={() => setSp(on)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
                sp === on ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
              )}
            >
              {on ? "Sequence parallel, 8 GPUs" : "One GPU"}
            </button>
          ))}
        </div>
        <p className="font-mono text-[12.5px] text-muted">
          one sample · <span className="text-ink">{TOKENS.toLocaleString("en-US")}</span> tokens
        </p>
      </div>

      {/* The sequence, coloured by which GPU holds each piece. */}
      <div className="flex h-6 gap-[2px] overflow-hidden rounded-[6px]">
        {Array.from({ length: GPUS }, (_, g) => (
          <i
            key={g}
            className={clsx("block h-full flex-1 transition-colors duration-500", sp ? (g % 2 ? "bg-blue/35" : "bg-blue/60") : "bg-bridge/60")}
          />
        ))}
      </div>

      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {Array.from({ length: GPUS }, (_, g) => {
          const busy = sp || g === 0;
          const fill = sp ? 46 : g === 0 ? 100 : 0;
          return (
            <li key={g} className={clsx("grid gap-1.5 rounded-[12px] px-2.5 py-2 transition-colors duration-500", busy ? "bg-card" : "bg-card/40")}>
              <span className="flex items-center justify-between font-mono text-[10.5px] text-faint">
                GPU {g}
                {!sp && g === 0 && <span className="text-bridge">OOM</span>}
              </span>
              <span className="relative block h-12 overflow-hidden rounded-[6px] bg-white shadow-[inset_0_0_0_1px_var(--color-line)]">
                <i
                  className={clsx("absolute inset-x-0 bottom-0 block transition-[height,background-color] duration-500", !sp && g === 0 ? "bg-bridge/70" : "bg-blue/50")}
                  style={{ height: `${fill}%` }}
                />
              </span>
              <span className="font-mono text-[10.5px] text-muted">{busy ? (sp ? `${(PER / 1000).toFixed(1)}K tok` : "63.3K tok") : "idle"}</span>
            </li>
          );
        })}
      </ul>

      <p className="text-[14px] leading-relaxed text-muted">
        {sp
          ? "Each GPU holds one eighth of the sequence. They exchange what attention needs, so every token still sees the whole run."
          : "Activation memory grows with sequence length. At 63K tokens, one GPU runs out before the first step."}
      </p>
      <p className="font-mono text-[11px] text-faint">
        ml.p6-b200.48xlarge · 8× B200 · SP=8, DP=1 · the proof of concept was 16K. Memory fills are illustrative.
      </p>
    </div>
  );
}
