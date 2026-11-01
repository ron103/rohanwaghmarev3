"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const CHANNEL = "presence:site";
const MAX_DOTS = 5;

/**
 * How many people are on the site right now, via Ably presence. Connects only
 * if /api/presence-token is enabled (ABLY_API_KEY set); otherwise renders
 * nothing. Ably is loaded lazily so it never weighs on first paint.
 */
function usePresenceCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    const fetchToken = async () => {
      const res = await fetch("/api/presence-token", { method: "POST" });
      if (!res.ok) throw new Error(`presence token: ${res.status}`);
      return res.json();
    };

    (async () => {
      let first: unknown;
      try {
        first = await fetchToken(); // also tells us whether presence is enabled
      } catch {
        return;
      }
      if (cancelled) return;
      const Ably = await import("ably");
      let usedFirst = false;
      const client = new Ably.Realtime({
        authCallback: async (_params, callback) => {
          try {
            const token = usedFirst ? await fetchToken() : first;
            usedFirst = true;
            callback(null, token as Parameters<typeof callback>[1]);
          } catch (error) {
            callback(String(error), null);
          }
        },
      });
      const channel = client.channels.get(CHANNEL);
      const refresh = async () => {
        try {
          const members = await channel.presence.get();
          if (!cancelled) setCount(new Set(members.map((m) => m.clientId)).size);
        } catch {}
      };
      await channel.presence.subscribe(refresh);
      await channel.presence.enter();
      await refresh();
      cleanup = () => {
        channel.presence.leave().catch(() => {});
        client.close();
      };
      if (cancelled) cleanup();
    })().catch(() => {});

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return count;
}

/** One node per visitor (you first, in blue), with a tooltip, like her flowers. */
export function PresenceDots({ className }: { className?: string }) {
  const count = usePresenceCount();
  if (!count) return null;
  const others = count - 1;
  const label = others === 0 ? "Just you here right now" : `You and ${others} ${others === 1 ? "other" : "others"} are here right now`;
  const dots = Math.min(count, MAX_DOTS);

  return (
    <span tabIndex={0} role="img" aria-label={label} className={clsx("group/presence relative items-center", className)}>
      {Array.from({ length: dots }, (_, i) => (
        <i
          key={i}
          aria-hidden="true"
          className={clsx(
            "visitor-in relative -ml-1 block size-[14px] rounded-full border-2 border-white transition-[translate] duration-200 first:ml-0 group-hover/presence:translate-x-[calc(var(--j)*-3px)]",
            i === 0 ? "bg-blue" : "bg-ink-2",
          )}
          style={{ zIndex: dots - i, "--j": dots - 1 - i } as React.CSSProperties}
        />
      ))}
      {count > MAX_DOTS && <span className="ml-1 font-mono text-[11px] text-muted">+{count - MAX_DOTS}</span>}
      <span className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-10 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1.5 text-[12px] text-white opacity-0 transition-opacity group-hover/presence:opacity-100 group-focus-visible/presence:opacity-100">
        {label}
      </span>
    </span>
  );
}
