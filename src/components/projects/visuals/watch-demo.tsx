"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const RATE = 15; // $/hr, the app's default
const GOAL_H = 6; // daily goal
const SPEED = 120; // one real second = two minutes of shift

type Seg = { kind: "work" | "break"; start: number; end?: number };

const fmt = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/**
 * A working replica of Clockin's three Apple Watch pages, at 120× speed.
 * Earnings follow net work time only: on a break they freeze, as the app's
 * sessionWorkTime does.
 */
export function WatchDemo() {
  const [segs, setSegs] = useState<Seg[]>([]);
  const [now, setNow] = useState(0); // simulated seconds since the shift began
  const [page, setPage] = useState(0);
  const last = useRef<number | null>(null);
  const open = segs.at(-1);
  const running = !!open && open.end === undefined;
  const onBreak = running && open?.kind === "break";
  const clockedIn = running;

  useEffect(() => {
    if (!running) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      if (last.current !== null) setNow((n) => n + ((t - last.current!) / 1000) * SPEED);
      last.current = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const total = (kind: Seg["kind"]) => segs.filter((s) => s.kind === kind).reduce((n, s) => n + ((s.end ?? now) - s.start), 0);
  const work = total("work");
  const brk = total("break");
  const earned = (work / 3600) * RATE;
  const goal = Math.min(1, work / (GOAL_H * 3600));

  const close = (list: Seg[]) => list.map((s) => (s.end === undefined ? { ...s, end: now } : s));
  const clock = () => setSegs((l) => (clockedIn ? close(l) : [...l, { kind: "work", start: now }]));
  const toggleBreak = () => setSegs((l) => [...close(l), { kind: onBreak ? "work" : "break", start: now }]);
  const reset = () => {
    setSegs([]);
    setNow(0);
    setPage(0);
  };

  const span = Math.max(now, 3600);

  return (
    <div className="grid items-center gap-8 rounded-[18px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
      {/* The watch */}
      <div className="mx-auto grid w-[200px] justify-items-center gap-3">
        <div className="relative h-[236px] w-[196px] rounded-[54px] bg-[#1c1d22] p-[12px] shadow-[0_0_0_3px_#3a3b42,0_22px_40px_-18px_rgba(0,0,0,0.55)]">
          <span aria-hidden="true" className="absolute -right-[7px] top-[62px] h-10 w-[7px] rounded-r-[4px] bg-[#3a3b42]" />
          <div className="grid h-full grid-rows-[1fr_auto] overflow-hidden rounded-[42px] bg-black px-4 pb-3 pt-5 text-white">
            {page === 0 && (
              <div className="grid content-center justify-items-center gap-3">
                <p className={clsx("font-mono text-[11px] uppercase tracking-[0.12em]", onBreak ? "text-[#f0c66b]" : clockedIn ? "text-[#7fd6a3]" : "text-white/50")}>
                  {onBreak ? "on break" : clockedIn ? "working" : "off the clock"}
                </p>
                <p className="font-mono text-[26px] tabular-nums tracking-[-0.02em]">{fmt(work)}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clock}
                    className={clsx("rounded-full px-3 py-1.5 text-[12px] font-semibold", clockedIn ? "bg-[#ff453a] text-white" : "bg-[#30d158] text-black")}
                  >
                    {clockedIn ? "Clock out" : "Clock in"}
                  </button>
                  {clockedIn && (
                    <button type="button" onClick={toggleBreak} className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold">
                      {onBreak ? "End break" : "Break"}
                    </button>
                  )}
                </div>
              </div>
            )}
            {page === 1 && (
              <div className="grid content-center gap-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">work</p>
                <p className="font-mono text-[22px] tabular-nums text-[#7fd6a3]">{fmt(work)}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">break</p>
                <p className="font-mono text-[22px] tabular-nums text-[#f0c66b]">{fmt(brk)}</p>
              </div>
            )}
            {page === 2 && (
              <div className="grid content-center justify-items-center gap-1">
                <svg viewBox="0 0 80 80" className="size-[86px] -rotate-90" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#2c2d33" strokeWidth="9" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#30d158" strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - goal} />
                </svg>
                <p className="font-mono text-[20px] tabular-nums">${earned.toFixed(2)}</p>
                <p className="text-[10.5px] text-white/50">{Math.round(goal * 100)}% of {GOAL_H}h goal</p>
              </div>
            )}
            <div className="flex justify-center gap-1.5" role="tablist" aria-label="Watch pages">
              {[0, 1, 2].map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={page === p}
                  aria-label={["Clock", "Totals", "Earnings"][p]}
                  onClick={() => setPage(p)}
                  className={clsx("size-[7px] rounded-full", page === p ? "bg-white" : "bg-white/30")}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="font-mono text-[11px] text-faint">tap the dots to change pages</p>
      </div>

      {/* What it's doing */}
      <div className="grid min-w-0 gap-4">
        <dl className="grid grid-cols-3 gap-3">
          {[
            ["net work", fmt(work)],
            ["breaks", fmt(brk)],
            ["earned", `$${earned.toFixed(2)}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[12px] bg-card px-3 py-2">
              <dt className="font-mono text-[11px] text-faint">{k}</dt>
              <dd className="font-mono text-[17px] tabular-nums text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-1.5">
          <div className="relative h-4 overflow-hidden rounded-full bg-card" aria-label="Shift timeline" role="img">
            {segs.map((s, n) => (
              <i
                key={n}
                className={clsx("absolute inset-y-0 block", s.kind === "work" ? "bg-[#30d158]/80" : "bg-[#f0c66b]")}
                style={{ left: `${(s.start / span) * 100}%`, width: `${(((s.end ?? now) - s.start) / span) * 100}%` }}
              />
            ))}
          </div>
          <p className="flex justify-between font-mono text-[11px] text-faint">
            <span>shift start</span>
            <span>
              {running ? "running at 120×" : segs.length ? "clocked out" : "press Clock in"} ·{" "}
              <button type="button" onClick={reset} className="underline decoration-dotted underline-offset-2 hover:text-blue">
                reset
              </button>
            </span>
          </p>
        </div>
        <p className="text-[14px] leading-relaxed text-muted">
          Earnings tick at ${RATE}/hr against net work time only. Start a break and watch the number freeze. That&apos;s the app&apos;s separate
          <code className="mx-1 rounded bg-card px-1 font-mono text-[12px]">sessionWorkTime</code>
          counter.
        </p>
      </div>
    </div>
  );
}
