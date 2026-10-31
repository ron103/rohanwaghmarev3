"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

const COLS = 8;
const ROWS = 5;

/**
 * Covers media with a checkerboard of tiles that flash, spin and shrink away
 * once the content is ready. Pass `ready` for real media (set it on load);
 * without it, the reveal plays when the box scrolls into view.
 */
export function TilePop({ children, ready, className }: { children: ReactNode; ready?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [gone, setGone] = useState(false);

  // Stable pseudo-random rotation and delay per tile.
  const tiles = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const n = Math.sin(i * 12.9898) * 43758.5453;
        const rand = n - Math.floor(n);
        return { delay: c * 32 + r * 44 + rand * 70, rot: (rand - 0.5) * 44, alt: (c + r) % 2 === 0 };
      }),
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = inView && (ready ?? true);

  useEffect(() => {
    if (!go) return;
    const id = window.setTimeout(() => setGone(true), 1100);
    return () => window.clearTimeout(id);
  }, [go]);

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      {children}
      {!gone && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        >
          {tiles.map((t, i) => (
            <i
              key={i}
              className={clsx("block", t.alt ? "bg-card" : "bg-card-2")}
              style={
                go
                  ? ({
                      animation: "tile-pop 560ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                      animationDelay: `${t.delay}ms`,
                      "--tile-rot": `${t.rot}deg`,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
