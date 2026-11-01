"use client";

import { useState } from "react";
import clsx from "clsx";

// 40 training labels; the teacher gets 7 confidently wrong. Illustrative.
const WRONG = new Set([3, 9, 14, 21, 26, 31, 37]);

const W = 560;
const H = 200;
const PAD = { l: 40, r: 14, t: 14, b: 26 };
const x = (i: number) => PAD.l + (i / 7) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - (v - 70) / 30) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

// Accuracy as training rounds go on. Shape is illustrative; 98% is the real result.
const TEACHER = [74, 82, 87, 89.5, 90.5, 90.8, 90.4, 90];
const GOLD = [74, 82, 87, 89.5, 92.5, 95, 97, 98];
const HUMAN = 94;

/** Teacher labels vs. human gold labels: what the student learns, and where it tops out. */
export function DistillFigure() {
  const [gold, setGold] = useState(false);

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <div role="tablist" aria-label="Label source" className="flex w-fit rounded-full bg-card p-1">
        {[false, true].map((g) => (
          <button
            key={String(g)}
            role="tab"
            aria-selected={gold === g}
            onClick={() => setGold(g)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
              gold === g ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
            )}
          >
            {g ? "+ 4,000 gold labels" : "Teacher labels only"}
          </button>
        ))}
      </div>

      {/* Flow: who writes the labels the student learns from. */}
      <div className="grid items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="grid gap-1 rounded-[12px] bg-card px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold text-ink-2">{gold ? "Humans" : "Teacher LLM"}</span>
          <span className="text-[11.5px] text-muted">{gold ? "4,000-row gold set" : "bigger model, sure of itself"}</span>
        </div>
        <div className="grid gap-1.5">
          <span className="font-mono text-[10.5px] text-faint">labels the student learns from</span>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 40 }, (_, i) => {
              const bad = WRONG.has(i) && !gold;
              return (
                <i
                  key={i}
                  className={clsx("block size-2.5 rounded-[3px] transition-colors duration-500", bad ? "bg-bridge" : gold && WRONG.has(i) ? "bg-ok" : "bg-blue/45")}
                  style={{ transitionDelay: `${i * 8}ms` }}
                />
              );
            })}
          </div>
        </div>
        <div className="grid gap-1 rounded-[12px] bg-blue-fill px-3.5 py-2.5">
          <span className="text-[13.5px] font-semibold text-ink">Student</span>
          <span className="text-[11.5px] text-muted">small QLoRA adapter</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={gold ? "With gold labels, accuracy climbs to 98%." : "With teacher labels only, accuracy plateaus below the human baseline."}>
        {[70, 80, 90, 100].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeDasharray="3 4" />
            <text x={PAD.l - 8} y={y(v) + 3} textAnchor="end" className="fill-[var(--color-faint)] font-mono text-[10px]">
              {v}%
            </text>
          </g>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(HUMAN)} y2={y(HUMAN)} stroke="var(--color-ink-2)" strokeOpacity="0.5" strokeDasharray="6 4" />
        <text x={W - PAD.r} y={y(HUMAN) - 6} textAnchor="end" className="fill-[var(--color-muted)] font-mono text-[10px]">
          human baseline
        </text>
        <path d={path(TEACHER)} fill="none" stroke="var(--color-bridge)" strokeWidth="2.2" />
        <path
          d={path(GOLD)}
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth="2.4"
          pathLength={1}
          strokeDasharray="1"
          className="transition-[stroke-dashoffset] duration-[900ms] ease-out"
          style={{ strokeDashoffset: gold ? 0 : 1 }}
        />
        <text x={x(7)} y={y(TEACHER[7]) + 16} textAnchor="end" className="fill-[var(--color-bridge)] font-mono text-[10.5px]">
          teacher labels: stuck
        </text>
        <text
          x={x(7)}
          y={y(98) - 8}
          textAnchor="end"
          className={clsx("fill-[var(--color-blue)] font-mono text-[10.5px] transition-opacity duration-500", gold ? "opacity-100" : "opacity-0")}
        >
          gold set: 98%
        </text>
        <text x={PAD.l} y={H - 6} className="fill-[var(--color-faint)] font-mono text-[10px]">
          more training →
        </text>
      </svg>
    </div>
  );
}
