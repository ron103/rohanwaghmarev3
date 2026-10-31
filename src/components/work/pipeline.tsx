"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { PipeNode, Pipeline as PipelineData } from "@/content/work";

const W = 120; // node width
const H = 52; // node height
const MS_PER_SEC = 70; // one simulated second plays in 70ms
const HOP_MS = 220; // time for a packet to travel an edge

type Pt = { x: number; y: number };
type Curve = [Pt, Pt, Pt, Pt];

/** Pick sides to connect, then a smooth cubic between them. */
function curve(a: PipeNode, b: PipeNode): Curve {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const vertical = Math.abs(dy) > 60 && Math.abs(dx) < 180;
  if (vertical) {
    const s = Math.sign(dy);
    const p0 = { x: a.x, y: a.y + (s * H) / 2 };
    const p3 = { x: b.x, y: b.y - (s * H) / 2 };
    const my = (p0.y + p3.y) / 2;
    return [p0, { x: p0.x, y: my }, { x: p3.x, y: my }, p3];
  }
  const s = Math.sign(dx) || 1;
  const p0 = { x: a.x + (s * W) / 2, y: a.y };
  const p3 = { x: b.x - (s * W) / 2, y: b.y };
  const mx = (p0.x + p3.x) / 2;
  return [p0, { x: mx, y: p0.y }, { x: mx, y: p3.y }, p3];
}

const d = (c: Curve) => `M${c[0].x},${c[0].y} C${c[1].x},${c[1].y} ${c[2].x},${c[2].y} ${c[3].x},${c[3].y}`;
function at(c: Curve, t: number): Pt {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return { x: k.reduce((s, w, i) => s + w * c[i].x, 0), y: k.reduce((s, w, i) => s + w * c[i].y, 0) };
}

/** Lay out a run: when each node starts and ends, in real ms and in simulated seconds. */
function schedule(p: PipelineData) {
  const solid = p.edges.filter((e) => e[2] !== "dashed");
  const start = new Map<string, number>();
  const simStart = new Map<string, number>();
  const roots = p.nodes.filter((n) => !solid.some(([, to]) => to === n.id));
  roots.forEach((n) => {
    start.set(n.id, 0);
    simStart.set(n.id, 0);
  });
  // Relax edges until stable (graphs here are tiny DAGs).
  for (let pass = 0; pass < p.nodes.length; pass++) {
    for (const [from, to] of solid) {
      if (!start.has(from)) continue;
      const fromNode = p.nodes.find((n) => n.id === from)!;
      const end = start.get(from)! + (fromNode.secs ?? 0) * MS_PER_SEC + HOP_MS;
      const simEnd = simStart.get(from)! + (fromNode.secs ?? 0);
      if (end > (start.get(to) ?? -1)) start.set(to, end);
      if (simEnd > (simStart.get(to) ?? -1)) simStart.set(to, simEnd);
    }
  }
  const total = Math.max(...p.nodes.filter((n) => start.has(n.id)).map((n) => start.get(n.id)! + (n.secs ?? 0) * MS_PER_SEC));
  return { start, simStart, total, solid };
}

const kindStyle: Record<NonNullable<PipeNode["kind"]>, string> = {
  io: "fill-white stroke-[var(--color-line)]",
  llm: "fill-[url(#hatch)] stroke-[#c4c6be] [stroke-dasharray:4_3]",
  model: "fill-[var(--color-blue-fill)] stroke-[var(--color-blue)]",
  code: "fill-white stroke-[#c4c6be]",
  store: "fill-[var(--color-card)] stroke-[#c4c6be]",
};

export function Pipeline({ before, after }: { before: PipelineData; after: PipelineData }) {
  const [which, setWhich] = useState<"before" | "after">("after");
  const data = which === "before" ? before : after;
  const [selected, setSelected] = useState<string | null>(null);
  const [t, setT] = useState<number | null>(null); // real ms into the run; null = idle
  const raf = useRef(0);

  const plan = useMemo(() => schedule(data), [data]);
  const nodes = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data]);
  const sel = nodes.get(selected ?? "") ?? data.nodes.find((n) => n.kind === "model" || n.kind === "llm") ?? data.nodes.find((n) => n.secs) ?? data.nodes[0];

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const run = () => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(plan.total);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const el = now - t0;
      setT(Math.min(el, plan.total));
      if (el < plan.total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const switchTo = (w: "before" | "after") => {
    cancelAnimationFrame(raf.current);
    setT(null);
    setSelected(null);
    setWhich(w);
  };

  // Simulated clock: the furthest any node has progressed.
  const simNow =
    t === null
      ? 0
      : Math.max(
          0,
          ...data.nodes.map((n) => {
            const s = plan.start.get(n.id);
            if (s === undefined || t < s) return 0;
            return plan.simStart.get(n.id)! + Math.min(n.secs ?? 0, (t - s) / MS_PER_SEC);
          }),
        );
  const done = t !== null && t >= plan.total;

  const group = data.group
    ? (() => {
        const g = data.group.ids.map((id) => nodes.get(id)!);
        const x0 = Math.min(...g.map((n) => n.x)) - W / 2 - 14;
        const x1 = Math.max(...g.map((n) => n.x)) + W / 2 + 14;
        const y0 = Math.min(...g.map((n) => n.y)) - H / 2 - 26;
        const y1 = Math.max(...g.map((n) => n.y)) + H / 2 + 12;
        return { x0, x1, y0, y1, label: data.group.label };
      })()
    : null;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Pipeline version" className="flex rounded-full bg-card p-1">
          {(["before", "after"] as const).map((w) => (
            <button
              key={w}
              role="tab"
              aria-selected={which === w}
              onClick={() => switchTo(w)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[13.5px] font-medium capitalize transition-[background-color,color] duration-200",
                which === w ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
              )}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] tabular-nums text-muted" aria-live="polite">
            {t === null ? "idle" : done ? `done in ${simNow.toFixed(1)}s` : `t = ${simNow.toFixed(1)}s`}
          </span>
          <button
            type="button"
            onClick={run}
            data-cursor="run a request"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[13.5px] font-medium text-white transition-[scale,opacity] active:scale-[0.96]"
          >
            {done ? <RotateCcw className="size-3.5" strokeWidth={2} /> : <Play className="size-3.5 fill-current" strokeWidth={2} />}
            {done ? "Run again" : "Run"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[18px] bg-white shadow-[inset_0_0_0_1px_var(--color-line)]">
        <svg viewBox="-6 -4 772 308" className="block w-full min-w-[640px]" role="group" aria-label={`${which} pipeline`}>
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="#f6f6f3" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#dcddd6" strokeWidth="2" />
            </pattern>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#b8bab2" />
            </marker>
          </defs>

          {group && (
            <g>
              <rect x={group.x0} y={group.y0} width={group.x1 - group.x0} height={group.y1 - group.y0} rx="16" fill="none" stroke="var(--color-blue)" strokeOpacity="0.35" strokeDasharray="5 4" />
              <text x={group.x0 + 12} y={group.y0 + 16} className="fill-[var(--color-blue)] font-mono text-[10.5px]">
                {group.label}
              </text>
            </g>
          )}

          {data.edges.map(([a, b, style]) => {
            const c = curve(nodes.get(a)!, nodes.get(b)!);
            const from = nodes.get(a)!;
            const s = plan.start.get(a);
            const leave = s === undefined ? undefined : s + (from.secs ?? 0) * MS_PER_SEC;
            const progress = t === null || leave === undefined || style === "dashed" ? null : (t - leave) / HOP_MS;
            const lit = progress !== null && progress >= 0;
            const dot = progress !== null && progress >= 0 && progress <= 1 ? at(c, progress) : null;
            return (
              <g key={`${a}-${b}`}>
                <path
                  d={d(c)}
                  fill="none"
                  markerEnd="url(#arrow)"
                  stroke={lit ? "var(--color-blue)" : "#c4c6be"}
                  strokeWidth={lit ? 1.6 : 1.2}
                  strokeDasharray={style === "dashed" ? "4 4" : undefined}
                  className="transition-[stroke] duration-200"
                />
                {dot && <circle cx={dot.x} cy={dot.y} r="4.5" className="fill-[var(--color-blue)]" />}
              </g>
            );
          })}

          {data.nodes.map((n) => {
            const s = plan.start.get(n.id);
            const end = s === undefined ? undefined : s + (n.secs ?? 0) * MS_PER_SEC;
            const active = t !== null && !done && s !== undefined && t >= s && t < end! + (n.secs ? 0 : 160);
            const finished = t !== null && end !== undefined && t >= end && !active;
            const isSel = sel?.id === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x - W / 2}, ${n.y - H / 2})`}
                onClick={() => setSelected(n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(n.id))}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${n.label}${n.sub ? `, ${n.sub}` : ""}`}
                data-cursor="what does this do?"
                className="outline-none [&:focus-visible>rect:first-child]:stroke-[var(--color-blue)] [&:focus-visible>rect:first-child]:[stroke-width:2]"
              >
                <rect
                  width={W}
                  height={H}
                  rx="12"
                  strokeWidth={isSel ? 2 : 1.2}
                  className={clsx(kindStyle[n.kind ?? "io"], isSel && "!stroke-[var(--color-ink)]", "transition-[stroke] duration-200")}
                />
                {active && <rect width={W} height={H} rx="12" fill="none" stroke="var(--color-blue)" strokeWidth="2.5" className="animate-[heartbeat_1s_ease-in-out_infinite] [transform-box:fill-box] [transform-origin:center]" />}
                <text x={W / 2} y={n.sub ? 22 : 30} textAnchor="middle" className="fill-[var(--color-ink)] font-sans text-[12.5px] font-semibold">
                  {n.label}
                </text>
                {n.sub && (
                  <text x={W / 2} y={38} textAnchor="middle" className="fill-[var(--color-muted)] font-mono text-[10px]">
                    {n.sub}
                  </text>
                )}
                {finished && n.secs ? (
                  <text x={W - 8} y={-6} textAnchor="end" className="fill-[var(--color-blue)] font-mono text-[10px]">
                    {n.secs}s
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {sel && (
        <div aria-live="polite" className="grid gap-1 rounded-[14px] bg-card px-4 py-3">
          <p className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-semibold text-ink-2">
            {sel.label}
            {sel.sub && <span className="font-mono text-[11.5px] font-normal text-muted">{sel.sub}</span>}
            {sel.secs ? <span className="ml-auto font-mono text-[11.5px] font-normal text-faint">~{sel.secs}s</span> : null}
          </p>
          <p className="text-[14.5px] leading-relaxed text-muted">{sel.detail}</p>
        </div>
      )}
      <p className="font-mono text-[11.5px] text-faint">Click any step for details · Run plays a request at relative speed</p>
    </div>
  );
}
