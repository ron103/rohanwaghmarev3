"use client";

import { useRef, useState } from "react";
import clsx from "clsx";

const W = 560;
const H = 340;
const K = 8;
const TOPICS = [
  { name: "compute config", color: "#2f3fd1" },
  { name: "access policy", color: "#2e8b57" },
  { name: "billing rule", color: "#c58a14" },
  { name: "data retention", color: "#8a4fb5" },
];
// Where each topic sits when only the free text is embedded.
const TOPIC_AT = [
  { x: 150, y: 100 },
  { x: 410, y: 95 },
  { x: 140, y: 250 },
  { x: 420, y: 250 },
];
// Where records drift when region/module/owner fields dominate the vector.
const FILED_AT = [
  { x: 190, y: 160 },
  { x: 370, y: 140 },
  { x: 280, y: 255 },
];

type Mode = "concat" | "text";
type Pt = { x: number; y: number };

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** 60 fake records: each has a topic (what it means) and a filing bucket (how it's stored). */
function makeRecords() {
  const r = seeded(42);
  const g = () => (r() + r() + r() - 1.5) * 0.9; // roughly normal
  return Array.from({ length: 60 }, (_, i) => {
    const topic = i % 4;
    const filed = Math.floor(r() * 3);
    const text = { x: TOPIC_AT[topic].x + g() * 46, y: TOPIC_AT[topic].y + g() * 34 };
    const concat = {
      x: TOPIC_AT[topic].x * 0.15 + FILED_AT[filed].x * 0.85 + g() * 52,
      y: TOPIC_AT[topic].y * 0.15 + FILED_AT[filed].y * 0.85 + g() * 40,
    };
    return { topic, text, concat };
  });
}

const RECORDS = makeRecords();
const QUERY_TOPIC = 0;
// The same query, embedded each way (the centroid of its topic in that layout).
const QUERY_AT: Record<Mode, Pt> = { text: { x: 172, y: 112 }, concat: { x: 243, y: 182 } };

/**
 * Nearest-neighbor retrieval on a 2D stand-in for embedding space. Toggle how
 * records are embedded and drag the query to see how many of its K nearest
 * neighbors actually share its topic.
 */
export function EmbeddingFigure() {
  const records = RECORDS;
  const [mode, setMode] = useState<Mode>("concat");
  const [query, setQuery] = useState<Pt>(QUERY_AT.concat);
  const [dragging, setDragging] = useState(false);
  const svg = useRef<SVGSVGElement>(null);

  const pos = (i: number) => (mode === "text" ? records[i].text : records[i].concat);
  // 60 points: cheap enough to rank on every render.
  const neighbors = records
    .map((_, i) => ({ i, d: Math.hypot(pos(i).x - query.x, pos(i).y - query.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, K)
    .map((n) => n.i);
  const hits = neighbors.filter((i) => records[i].topic === QUERY_TOPIC).length;

  const toSvg = (e: React.PointerEvent): Pt | null => {
    const m = svg.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: Math.min(W - 10, Math.max(10, p.x)), y: Math.min(H - 10, Math.max(10, p.y)) };
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setQuery(QUERY_AT[m]);
  };

  return (
    <div className="grid gap-4 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="How records are embedded" className="flex rounded-full bg-card p-1">
          {(
            [
              ["concat", "All fields in one vector"],
              ["text", "Free text only"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
                mode === m ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[12px] text-muted" aria-live="polite">
          recall@{K}: <b className={clsx("font-medium", hits >= 6 ? "text-ok" : "text-[#c0392b]")}>{hits}/{K}</b> share the topic
        </p>
      </div>

      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className={clsx("block w-full touch-none select-none rounded-[12px] bg-[#fbfbf9]", dragging ? "cursor-grabbing" : "cursor-grab")}
        onPointerDown={(e) => {
          const p = toSvg(e);
          if (!p) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setQuery(p);
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const p = toSvg(e);
          if (p) setQuery(p);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        role="img"
        aria-label={`Scatter of 60 records. The query's ${K} nearest neighbors include ${hits} with the same topic.`}
      >
        {neighbors.map((i) => (
          <line key={`l${i}`} x1={query.x} y1={query.y} x2={pos(i).x} y2={pos(i).y} stroke={records[i].topic === QUERY_TOPIC ? "#2f3fd1" : "#c0392b"} strokeOpacity="0.35" strokeWidth="1.2" />
        ))}
        {records.map((r, i) => {
          const p = pos(i);
          const near = neighbors.includes(i);
          return (
            <g key={i} style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: dragging ? undefined : "transform 700ms cubic-bezier(0.22,1,0.36,1)" }}>
              {near && <circle r="8" fill="none" stroke={r.topic === QUERY_TOPIC ? "#2f3fd1" : "#c0392b"} strokeWidth="1.5" />}
              <circle r="4.2" fill={TOPICS[r.topic].color} fillOpacity={near ? 1 : 0.55} />
            </g>
          );
        })}
        <g style={{ transform: `translate(${query.x}px, ${query.y}px)` }}>
          <circle r="11" fill="#fff" stroke="#1b1e24" strokeWidth="2" />
          <circle r="4" fill="#1b1e24" />
        </g>
      </svg>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px] text-muted">
        {TOPICS.map((t, i) => (
          <li key={t.name} className="flex items-center gap-1.5">
            <i className="block size-2 rounded-full" style={{ background: t.color }} />
            {t.name}
            {i === QUERY_TOPIC && <span className="text-faint">(query)</span>}
          </li>
        ))}
        <li className="ml-auto text-faint">drag the ◉ query</li>
      </ul>
    </div>
  );
}
