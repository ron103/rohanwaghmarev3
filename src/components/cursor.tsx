"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor prompt: hover anything with `data-cursor="label"` and a small ink-blue
 * label trails the mouse, streaming its words in one at a time like a model
 * reply. Mouse only; hidden on touch, on press, and for reduced motion users
 * it appears instantly.
 */
export function CursorPrompt() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [shown, setShown] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let current: Element | null = null;

    const loop = () => {
      const k = reduce ? 1 : 0.24;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x + 14}px, ${pos.y + 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as Element).closest?.("[data-cursor]") ?? null;
      if (el !== current) {
        current = el;
        if (el) {
          if (!visible) Object.assign(pos, target);
          setText(el.getAttribute("data-cursor") ?? "");
          setShown(0);
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };
    const hide = () => {
      current = null;
      setVisible(false);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
    // `visible` is read only to seed the position on first show.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stream the label's words in.
  const words = text.split(/\s+/).filter(Boolean);
  useEffect(() => {
    if (!visible || shown >= words.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setShown((n) => (reduce ? words.length : n + 1)), shown === 0 ? 40 : 95);
    return () => window.clearTimeout(id);
  }, [visible, shown, words.length]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[140] select-none transition-opacity duration-150"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/90 py-1 pl-2 pr-2.5 font-mono text-[11px] font-medium tracking-[0.03em] text-blue shadow-[0_0_0_1px_var(--color-line),0_8px_18px_-10px_rgba(0,0,0,0.35)] backdrop-blur">
        <i className="block size-[6px] rounded-full bg-blue" />
        <span className="relative">
          <span className="invisible">{text}</span>
          <span className="absolute inset-0">{words.slice(0, shown).join(" ")}</span>
        </span>
      </span>
    </div>
  );
}
