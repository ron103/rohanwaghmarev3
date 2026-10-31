"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { pacificTime, statusFor } from "@/lib/site";

/** Re-reads the Pacific clock every 30s. Renders nothing until mounted, so SSR and client agree. */
export function usePacificNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return now;
}

export function StatusPill({ className }: { className?: string }) {
  const now = usePacificNow();
  return (
    <span
      className={clsx(
        "items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11.5px] text-muted shadow-[inset_0_0_0_1px_var(--color-line)]",
        className,
      )}
    >
      <i className="heartbeat block size-[7px] rounded-full bg-ok shadow-[0_0_0_3px_rgb(46_139_87/0.18)]" />
      {now ? `${pacificTime(now)} PT` : "PT"}
    </span>
  );
}

export function StatusLine({ className }: { className?: string }) {
  const now = usePacificNow();
  return <span className={className}>{now ? statusFor(now) : " "}</span>;
}
