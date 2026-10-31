"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Project } from "@/content/projects";
import { Terminal } from "./terminal";

const ADVANCE_MS = 14000;

/**
 * List on the left, the selected project on the right with a live terminal.
 * Auto-advances until the visitor hovers, focuses, or types; the selection is
 * kept in the URL hash so /projects#tb-detection deep-links.
 */
export function Showcase({ projects }: { projects: Project[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false); // sticky once they type
  const [cycle, setCycle] = useState(0); // restarts the progress ring
  const p = projects[i];

  const select = useCallback(
    (n: number) => {
      const next = (n + projects.length) % projects.length;
      setI(next);
      setCycle((c) => c + 1);
      history.replaceState(null, "", `#${projects[next].slug}`);
    },
    [projects],
  );

  // Deep link.
  useEffect(() => {
    const read = () => {
      const n = projects.findIndex((x) => `#${x.slug}` === location.hash);
      if (n >= 0) setI(n);
    };
    const id = window.setTimeout(read, 0);
    window.addEventListener("hashchange", read);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("hashchange", read);
    };
  }, [projects]);

  // Auto-advance.
  const stopped = paused || engaged;
  useEffect(() => {
    if (stopped || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => select(i + 1), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [i, stopped, select]);

  return (
    <div
      className="grid gap-10 md:grid-cols-[240px_minmax(0,1fr)] md:gap-[72px]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul className="grid content-start gap-4 md:sticky md:top-[30vh] md:self-start" role="tablist" aria-label="Projects">
        {projects.map((x, n) => {
          const on = n === i;
          return (
            <li key={x.slug}>
              <button
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => select(n)}
                className={clsx("grid w-full gap-0.5 text-left transition-colors", on ? "text-ink" : "text-faint hover:text-blue")}
              >
                <span className="flex items-center gap-2 text-[15px] font-medium">
                  {x.title}
                  {on && (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 -rotate-90">
                      <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-line)" strokeWidth="2" />
                      <circle
                        key={`${i}-${cycle}-${stopped}`}
                        cx="8"
                        cy="8"
                        r="6"
                        fill="none"
                        stroke="var(--color-blue)"
                        strokeWidth="2"
                        pathLength={1}
                        strokeDasharray="1"
                        strokeDashoffset={stopped ? 0 : 1}
                        style={stopped ? undefined : { animation: `ring-fill ${ADVANCE_MS}ms linear forwards` }}
                      />
                    </svg>
                  )}
                </span>
                <span className={clsx("text-[13px] leading-snug", on ? "text-muted" : "text-faint/80")}>{x.oneLiner}</span>
              </button>
            </li>
          );
        })}
        <li className="pt-2 font-mono text-[12px] text-faint">more coming</li>
      </ul>

      <section aria-live="polite" className="grid min-w-0 content-start gap-6">
        <Terminal project={p} onNext={() => select(i + 1)} onUserInput={() => setEngaged(true)} />
        <div className="grid gap-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-serif text-[clamp(26px,3vw,34px)] font-light tracking-[-0.015em]">{p.title}</h2>
            {p.status && <span className="rounded-full bg-blue-fill px-2 py-0.5 font-mono text-[11px] text-blue">{p.status}</span>}
          </div>
          <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted">{p.description}</p>
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {p.metrics.map((m) => (
              <div key={m.caption}>
                <dd className="font-mono text-[24px] tracking-[-0.02em]">{m.value}</dd>
                <dt className="text-[12.5px] text-muted">{m.caption}</dt>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full bg-card px-3 py-1 font-mono text-[12px] text-ink-2">
                {s}
              </span>
            ))}
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-[13px] font-medium text-white transition-[scale] active:scale-[0.97]"
              >
                {l.label} <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
