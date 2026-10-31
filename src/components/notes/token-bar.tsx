"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

/** Reading progress for an article, counted in tokens instead of percent. */
export function TokenBar({ total, target }: { total: number; target: string }) {
  const [read, setRead] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(1, span)));
      setRead(Math.round(p * total));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target, total]);

  return (
    <div className="grid gap-2" aria-label={`Read about ${read} of ${total} tokens`}>
      <div className="flex items-baseline gap-1 font-mono text-[12px] tabular-nums text-muted">
        <NumberFlow value={read} className="text-ink" />
        <span>/ {total.toLocaleString()} tokens</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
        <div className="h-full origin-left bg-blue transition-transform duration-150" style={{ transform: `scaleX(${total ? read / total : 0})` }} />
      </div>
    </div>
  );
}
