"use client";

import { useState } from "react";
import clsx from "clsx";

// Stage sizes come from the bot's config; the ten analyses below are an
// illustrative sample of one hourly run.
const STAGES = [
  { n: 600, label: "open markets scanned", sub: "6 series × up to 100 (NBA, MLB, Fed, BTC, ETH, S&P)" },
  { n: 30, label: "top by 24h volume", sub: "3× the analysis budget" },
  { n: 10, label: "pass the filters", sub: "price 1–99¢, closes in 2h+, no existing bet" },
  { n: 10, label: "researched by Claude", sub: "web search, up to 10 tool turns each" },
];

const SAMPLE = [
  { m: "Fed holds rates in December", call: "YES", conf: 78, price: 0.71 },
  { m: "BTC above $70k on Friday", call: "NO", conf: 62, price: 0.44 },
  { m: "Lakers beat Celtics", call: "YES", conf: 58, price: 0.39 },
  { m: "S&P closes up this week", call: "SKIP", conf: 40, price: 0.55 },
  { m: "ETH above $3,000 Friday", call: "NO", conf: 71, price: 0.36 },
  { m: "Yankees win game 3", call: "SKIP", conf: 35, price: 0.5 },
  { m: "Fed cuts in January", call: "NO", conf: 69, price: 0.31 },
  { m: "Celtics cover the spread", call: "YES", conf: 66, price: 0.47 },
  { m: "BTC daily close green", call: "SKIP", conf: 30, price: 0.52 },
  { m: "Dodgers win series", call: "YES", conf: 74, price: 0.58 },
] as const;

const MAX_BETS = 5;
const STAKE = 50;

/**
 * One hourly run of the paper-trading agent: the funnel from every open
 * market down to a handful of bets, with the confidence gate as a slider.
 */
export function MarketFunnel() {
  const [gate, setGate] = useState(65);
  const ranked = [...SAMPLE].sort((a, b) => b.conf - a.conf);
  const passing = ranked.filter((s) => s.call !== "SKIP" && s.conf >= gate);
  const bets = passing.slice(0, MAX_BETS);

  return (
    <div className="grid gap-6 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <ol className="grid gap-2">
        {[...STAGES, { n: bets.length, label: "paper bets placed", sub: `$${STAKE} each, at most ${MAX_BETS} per run` }].map((s, i) => (
          <li key={s.label} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
            <span className="text-right font-mono text-[20px] tabular-nums tracking-[-0.02em] text-ink">{s.n}</span>
            <div className="grid gap-1">
              <div className="h-3 overflow-hidden rounded-full bg-card">
                <i
                  className={clsx("block h-full rounded-full transition-[width] duration-500", i === STAGES.length ? "bg-ok" : "bg-blue/70")}
                  style={{ width: `${Math.max(2, (Math.log10(s.n + 1) / Math.log10(601)) * 100).toFixed(1)}%` }}
                />
              </div>
              <p className="text-[13px] text-ink-2">
                {s.label} <span className="text-muted">· {s.sub}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-3">
        <label htmlFor="conf-gate" className="flex items-center justify-between gap-3 text-[13.5px] text-ink-2">
          Confidence gate
          <span className="font-mono text-[13px] text-blue">≥ {gate}%</span>
        </label>
        <input id="conf-gate" type="range" min={40} max={90} value={gate} onChange={(e) => setGate(Number(e.target.value))} className="scrubber w-full" />
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {ranked.map((s) => {
            const bet = bets.includes(s);
            const cut = !bet && s.call !== "SKIP" && s.conf >= gate; // passed the gate but over the per-run cap
            return (
              <li
                key={s.m}
                className={clsx(
                  "flex items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors",
                  bet ? "bg-blue-fill text-ink" : "bg-card/70 text-muted",
                )}
              >
                <span className="min-w-0 truncate">{s.m}</span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-[11.5px]">
                  <span className={s.call === "SKIP" ? "text-faint" : s.call === "YES" ? "text-ok" : "text-[#c0392b]"}>{s.call}</span>
                  <span>{s.conf}%</span>
                  {bet && <span className="rounded bg-blue px-1.5 text-white">${STAKE}</span>}
                  {cut && <span className="text-faint">cap</span>}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="font-mono text-[11px] text-faint">Stage sizes are from the bot&apos;s config. The ten markets are an illustrative sample run.</p>
      </div>
    </div>
  );
}
