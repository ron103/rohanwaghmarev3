"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

const lines = [
  "I turn 90-second pipelines into 11-second ones.",
  "I fine-tune models, then make them cheap.",
  "I give LLMs tools, and keep them honest.",
  "I build knowledge graphs people can talk to.",
  "I ship agents that leave an audit trail.",
];
// Every fifth regenerate gets one of these instead.
const jokes = ["I also hallucinate sometimes. Rarely in prod.", "Temperature set to 0. Personality set to 1."];

const longest = [...lines, ...jokes].reduce((a, b) => (b.length > a.length ? b : a));
const AUTO_MS = 6500;

/**
 * The hero's second line, streamed in token by token like a model reply.
 * It is complete at rest (first line rendered on the server), cycles on its
 * own while visible, and has a Regenerate button.
 */
export function StreamingTagline() {
  const [text, setText] = useState(lines[0]);
  const [shown, setShown] = useState(Infinity); // tokens visible; Infinity = whole line
  const [streaming, setStreaming] = useState(false);
  const [spin, setSpin] = useState(0);
  const index = useRef(0);
  const clicks = useRef(0);
  const paused = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  const tokens = text.match(/\S+\s*/g) ?? [];

  const next = useCallback((fromClick: boolean) => {
    let line: string;
    if (fromClick && ++clicks.current % 5 === 0) {
      line = jokes[(clicks.current / 5 - 1) % jokes.length];
    } else {
      index.current = (index.current + 1) % lines.length;
      line = lines[index.current];
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setText(line);
    setShown(reduce ? Infinity : 0);
    setStreaming(!reduce);
  }, []);

  // Reveal one token at a time with a little jitter, like real streaming.
  useEffect(() => {
    if (!streaming) return;
    if (shown >= tokens.length) {
      const id = window.setTimeout(() => setStreaming(false), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 55 + Math.random() * 120);
    return () => window.clearTimeout(id);
  }, [streaming, shown, tokens.length]);

  // Auto-cycle while on screen and not hovered.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    const id = window.setInterval(() => {
      if (visible.current && !paused.current && !streaming && document.visibilityState === "visible") next(false);
    }, AUTO_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [next, streaming]);

  return (
    <div
      ref={root}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      className="grid justify-items-start gap-3"
    >
      <p
        aria-live="polite"
        className="grid font-serif text-[clamp(34px,4.9vw,58px)] font-light leading-[1.06] tracking-[-0.015em] text-faint"
      >
        {/* Reserves the height of the longest line so the layout never jumps. */}
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {longest}
        </span>
        <span className="col-start-1 row-start-1">
          {tokens.map((t, i) =>
            i < shown ? (
              <span key={`${text}-${i}`} className={streaming ? "inline animate-[token-in_.35s_var(--ease-out-soft)_both]" : "inline"}>
                {t}
              </span>
            ) : null,
          )}
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.82em] w-[0.4em] translate-y-[0.08em] animate-[caret_1s_steps(1)_infinite] bg-blue align-baseline"
          />
        </span>
      </p>
      <button
        type="button"
        onClick={() => {
          setSpin((s) => s + 1);
          next(true);
        }}
        disabled={streaming}
        data-cursor="regenerate"
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[12px] text-muted transition-[background-color,color,scale] duration-150 hover:bg-blue-fill hover:text-blue active:scale-95 disabled:pointer-events-none disabled:opacity-60"
      >
        <RotateCw
          className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-soft)]"
          style={{ transform: `rotate(${spin * 360}deg)` }}
          strokeWidth={1.8}
        />
        Regenerate
      </button>
    </div>
  );
}
