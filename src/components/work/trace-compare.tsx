"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import clsx from "clsx";
import type { Span, Trace } from "@/content/work";

const REPLAY_MS = 6000;

function status(spans: Span[], t: number) {
  const end = Math.max(...spans.map((s) => s.start + s.dur));
  if (t >= end) return { label: "✓ done", done: true };
  const now = spans.filter((s) => t >= s.start && t < s.start + s.dur).map((s) => s.name);
  return { label: now.length ? now.join(" + ") : "waiting", done: false };
}

/**
 * Two traces on one time axis with a draggable playhead. Replay sweeps the
 * playhead across the whole run so you can watch the new pipeline finish
 * while the old one is still on its first step.
 */
export function TraceCompare({ trace }: { trace: Trace }) {
  const [t, setT] = useState(trace.axis * 0.14);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const fmt = (v: number) => (trace.unit === "s" ? `${v.toFixed(1)}s` : `${Math.round(v)}%`);
  const pct = (v: number) => `${(v / trace.axis) * 100}%`;

  useEffect(() => {
    if (!playing) return;
    const from = t >= trace.axis ? 0 : t;
    const t0 = performance.now() - (from / trace.axis) * REPLAY_MS;
    const tick = (now: number) => {
      const next = Math.min(trace.axis, ((now - t0) / REPLAY_MS) * trace.axis);
      setT(next);
      if (next < trace.axis) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // `t` only seeds the start position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, trace.axis]);

  const oldEnd = Math.max(...trace.before.map((s) => s.start + s.dur));
  const newEnd = Math.max(...trace.after.map((s) => s.start + s.dur));

  const lanes = [
    { key: "before", spans: trace.before, old: true },
    { key: "after", spans: trace.after, old: false },
  ];

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-5 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div className="grid grid-cols-[104px_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-4 font-mono text-[11px] md:grid-cols-[132px_minmax(0,1fr)]">
        {lanes.map(({ key, spans, old }, row) => {
          const s = status(spans, t);
          return (
            <div key={key} className="col-span-2 grid grid-cols-subgrid gap-y-1.5 pb-4 last:pb-0" style={{ gridRow: row + 1, gridColumn: "1 / span 2" }}>
              <span className="uppercase tracking-[0.08em] text-faint">{key}</span>
              <span className={clsx("truncate text-right", s.done ? "text-ok" : "text-ink-2")}>{s.label}</span>
              {spans.map((sp) => {
                const fill = Math.min(1, Math.max(0, (t - sp.start) / sp.dur));
                return (
                  <div key={sp.name} className="col-span-2 grid grid-cols-subgrid items-center">
                    <span className="truncate text-muted">{sp.name}</span>
                    <div className="relative h-5">
                      <div
                        className={clsx(
                          "absolute inset-y-0 overflow-hidden rounded-[5px]",
                          old
                            ? "bg-[repeating-linear-gradient(135deg,#d6d8d0_0_1.5px,transparent_1.5px_5px)] shadow-[inset_0_0_0_1px_#c4c6be]"
                            : "bg-blue/10 shadow-[inset_0_0_0_1px_rgb(47_63_209/0.45)]",
                        )}
                        style={{ left: pct(sp.start), width: `max(4px, ${pct(sp.dur)})` }}
                      >
                        <div className={clsx("h-full origin-left", old ? "bg-ink-2/25" : "bg-blue")} style={{ transform: `scaleX(${fill})` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Playhead and the new pipeline's finish line, over the track column only. */}
        <div aria-hidden="true" className="pointer-events-none relative col-start-2 row-start-1 row-end-[-1]">
          <div className="absolute -bottom-1 -top-1 border-l border-dashed border-blue/60" style={{ left: pct(newEnd) }} />
          <div className="absolute -bottom-1 -top-1 w-px bg-ink" style={{ left: pct(t) }}>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-1.5 py-px text-[10px] tabular-nums text-white">{fmt(t)}</span>
          </div>
        </div>
      </div>

      {/* Same columns as the lanes, so the slider knob sits under the playhead. */}
      <div className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-x-4 md:grid-cols-[132px_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause replay" : "Replay"}
          data-cursor={playing ? "pause" : "replay the race"}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-[scale] active:scale-95"
        >
          {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
        </button>
        <label htmlFor={`scrub-${trace.unit}`} className="sr-only">
          Playhead
        </label>
        <input
          id={`scrub-${trace.unit}`}
          type="range"
          min={0}
          max={trace.axis}
          step={trace.axis / 500}
          value={t}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value));
          }}
          className="scrubber -mx-[9px] w-[calc(100%+18px)]"
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11.5px] text-faint">
        <span>
          old finishes at <b className="font-medium text-ink-2">{fmt(oldEnd)}</b> · new at <b className="font-medium text-blue">{fmt(newEnd)}</b>
        </span>
        <span>{trace.note}</span>
      </div>
    </div>
  );
}
