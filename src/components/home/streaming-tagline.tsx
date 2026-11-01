"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

// Rohan's own lines. The first one always leads; the rest come in random order.
const lines = [
  "Once accidentally ended up at the pyramids.",
  "I almost never miss my water goal.",
  "I can talk about anything. Try me.",
  "Occasionally funny. Almost always hilarious.",
  "Fiction nerd. Currently deep in Dungeon Crawler Carl.",
  "I can explain anything like you're five.",
  "Decided I loved coding at age four.",
  "Building abs by December. Allegedly.",
];

const longest = lines.reduce((a, b) => (b.length > a.length ? b : a));
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
  const deck = useRef<number[]>([]);
  const paused = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(true);

  const tokens = text.match(/\S+\s*/g) ?? [];

  const next = useCallback(() => {
    // A shuffled deck: every line shows once before any repeats, and a new
    // round never starts with the line that just played.
    if (deck.current.length === 0) {
      const rest = lines.map((_, i) => i).filter((i) => i !== index.current);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      deck.current = rest;
    }
    index.current = deck.current.shift()!;
    const line = lines[index.current];
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
      if (visible.current && !paused.current && !streaming && document.visibilityState === "visible") next();
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
          next();
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
