"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GripVertical } from "lucide-react";
import {
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
  prepareRichInline,
  type PreparedRichInline,
  type RichInlineCursor,
  type RichInlineLine,
} from "@chenglou/pretext/rich-inline";
import { Portrait } from "../portrait";

export type Segment = { text: string; mark?: boolean };
export type Paragraph = Segment[];

const SIZE = 132; // portrait diameter
const PAD = 16; // breathing room between text and portrait
const LINE = 28; // line height in px
const PARA_GAP = 14;
const MIN_COLUMN = 90; // narrower than this, leave the row empty

type Laid = { y: number; x: number; line: RichInlineLine; para: number }[];

/** Widest free span on a row once the circle is cut out of it. */
function freeSpan(rowTop: number, width: number, cx: number, cy: number) {
  const r = SIZE / 2 + PAD;
  const nearest = Math.min(Math.max(cy, rowTop), rowTop + LINE);
  const dy = nearest - cy;
  if (Math.abs(dy) >= r) return { x: 0, w: width };
  const half = Math.sqrt(r * r - dy * dy);
  const left = Math.max(0, cx - half);
  const right = Math.max(0, width - (cx + half));
  return left >= right ? { x: 0, w: left } : { x: cx + half, w: right };
}

function flow(prepared: PreparedRichInline[], width: number, cx: number, cy: number) {
  const out: Laid = [];
  let y = 0;
  prepared.forEach((p, para) => {
    let cursor: RichInlineCursor | undefined;
    for (let guard = 0; guard < 400; guard++) {
      const span = freeSpan(y, width, cx, cy);
      if (span.w < MIN_COLUMN) {
        y += LINE;
        continue;
      }
      const range = layoutNextRichInlineLineRange(p, span.w, cursor);
      if (!range) break;
      out.push({ y, x: span.x, line: materializeRichInlineLineRange(p, range), para });
      cursor = range.end;
      y += LINE;
    }
    y += PARA_GAP;
  });
  return { lines: out, height: Math.max(y - PARA_GAP, cy + SIZE / 2) };
}

/**
 * The About story. Drag the portrait (or use the grip with arrow keys) and the
 * paragraphs rewrap around it line by line, measured with Pretext.
 * Before fonts load or JS runs, it renders as normal paragraphs with a float.
 */
export function StoryReflow({ paragraphs }: { paragraphs: Paragraph[] }) {
  const box = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [prepared, setPrepared] = useState<PreparedRichInline[] | null>(null);
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  // Portrait centre relative to the text box. null = default spot for this width.
  const [moved, setMoved] = useState<{ x: number; y: number } | null>(null);

  // Measure width.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Prepare text once the real font is loaded, using the computed font of a hidden probe.
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive || !measure.current) return;
      const cs = getComputedStyle(measure.current);
      const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      setPrepared(paragraphs.map((p) => prepareRichInline(p.map((s) => ({ text: s.text, font })))));
    });
    return () => {
      alive = false;
    };
  }, [paragraphs]);

  // Default spot: tucked into the right edge, beside the second paragraph.
  const pos = moved ?? { x: width - SIZE / 2 - (width < 520 ? 0 : 8), y: width < 520 ? LINE * 6 : LINE * 4 + SIZE / 2 };
  const layout = useMemo(() => (prepared && width ? flow(prepared, width, pos.x, pos.y) : null), [prepared, width, pos.x, pos.y]);

  const height = layout?.height ?? 0;
  const clampMove = (dx: number, dy: number) => {
    const r = SIZE / 2;
    // Functional update: several pointer moves can land before the next render.
    setMoved((prev) => {
      const from = prev ?? pos;
      return {
        x: Math.min(Math.max(r, from.x + dx), Math.max(r, width - r)),
        y: Math.min(Math.max(r, from.y + dy), Math.max(r, height - r)),
      };
    });
  };

  const ready = !!layout;

  return (
    <div ref={box} className="relative text-[16.5px] leading-[28px] text-ink-2">
      {/* Hidden probe: its computed font is what Pretext measures with. */}
      <p ref={measure} aria-hidden="true" className="pointer-events-none invisible absolute">
        x
      </p>

      {/* Accessible, server-rendered version. Hidden visually once the reflow takes over. */}
      <div className={ready ? "sr-only" : "grid gap-[14px]"}>
        {!ready && (
          <span className="float-right ml-4 mb-2 [shape-outside:circle(50%)]" style={{ width: SIZE, height: SIZE }}>
            <Portrait size={SIZE} />
          </span>
        )}
        {paragraphs.map((p, i) => (
          <p key={i}>
            {p.map((s, j) => (s.mark ? <span key={j} className="mark">{s.text}</span> : <span key={j}>{s.text}</span>))}
          </p>
        ))}
      </div>

      {ready && (
        <div aria-hidden="true" className="relative" style={{ height }}>
          {layout.lines.map(({ y: top, x: left, line }, i) => (
            <div key={i} className="absolute whitespace-pre" style={{ top, left }}>
              {line.fragments.map((f, j) => {
                const marked = !!paragraphs[layout.lines[i].para][f.itemIndex]?.mark;
                const gapMarked = marked && f.gapItemIndex >= 0 && !!paragraphs[layout.lines[i].para][f.gapItemIndex]?.mark;
                return (
                  <span key={j}>
                    {f.gapBefore > 0 && (
                      <span className={gapMarked ? "mark inline-block" : "inline-block"} style={{ width: f.gapBefore, paddingInline: 0 }}>
                        {"​"}
                      </span>
                    )}
                    <span className={marked ? "mark" : undefined} style={marked ? { paddingInline: 0 } : undefined}>
                      {f.text}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}

          <motion.div
            onPointerDown={(e) => {
              if (reduce || (e.target as Element).closest("button")) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              last.current = { x: e.clientX, y: e.clientY };
              setDragging(true);
            }}
            onPointerMove={(e) => {
              if (!dragging) return;
              const dx = e.clientX - last.current.x;
              const dy = e.clientY - last.current.y;
              last.current = { x: e.clientX, y: e.clientY };
              clampMove(dx, dy);
            }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            animate={{ scale: dragging ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            style={{ left: pos.x, top: pos.y, translateX: "-50%", translateY: "-50%", touchAction: "none" }}
            className={`absolute z-10 rounded-full shadow-[0_0_0_4px_#fff,0_0_0_5px_var(--color-line),0_14px_30px_-14px_rgba(0,0,0,0.35)] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            data-cursor={dragging ? undefined : "drag me around"}
          >
            <Portrait size={SIZE} />
            <button
              type="button"
              aria-label="Move portrait. Use arrow keys."
              onKeyDown={(e) => {
                const step = e.shiftKey ? 40 : 12;
                const moves: Record<string, [number, number]> = {
                  ArrowLeft: [-step, 0],
                  ArrowRight: [step, 0],
                  ArrowUp: [0, -step],
                  ArrowDown: [0, step],
                };
                const m = moves[e.key];
                if (!m) return;
                e.preventDefault();
                clampMove(...m);
              }}
              className="absolute -left-4 top-1/2 grid h-9 w-7 -translate-y-1/2 place-items-center rounded-full bg-white text-muted shadow-[0_0_0_1px_var(--color-line),0_4px_10px_-4px_rgba(0,0,0,0.25)] transition-colors hover:text-blue"
            >
              <GripVertical className="size-4" strokeWidth={1.8} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
