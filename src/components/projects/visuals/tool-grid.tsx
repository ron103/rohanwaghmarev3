"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import clsx from "clsx";

// Exact tool counts from the repo's mocks (191 total). GitHub is split into
// groups; "core" (read/search) always comes with it.
const SERVICES = [
  { id: "github", label: "GitHub", count: 86 },
  { id: "googlecalendar", label: "Calendar", count: 29 },
  { id: "linear", label: "Linear", count: 25 },
  { id: "gmail", label: "Gmail", count: 20 },
  { id: "googledrive", label: "Drive", count: 20 },
  { id: "slack", label: "Slack", count: 10 },
  { id: "perplexity", label: "Perplexity", count: 1 },
] as const;
type ServiceId = (typeof SERVICES)[number]["id"];
const GITHUB_CORE = 14;
const TOTAL = SERVICES.reduce((n, s) => n + s.count, 0);

// Example routes, following the router's own rules (recall over precision;
// relative dates pull in Calendar for the current date tool).
const REQUESTS: { text: string; services: ServiceId[]; miss: ServiceId }[] = [
  { text: "Schedule a sync with everyone on the Atlas project tomorrow", services: ["linear", "googlecalendar"], miss: "googlecalendar" },
  { text: "Summarize open PRs and post them in #eng", services: ["github", "slack"], miss: "slack" },
  { text: "Email Priya the Q3 planning doc from Drive", services: ["gmail", "googledrive"], miss: "googledrive" },
  { text: "What changed in vLLM this week?", services: ["perplexity", "googlecalendar"], miss: "googlecalendar" },
];

function visibleTools(ids: ServiceId[]) {
  return ids.reduce((n, id) => n + (id === "github" ? GITHUB_CORE : SERVICES.find((s) => s.id === id)!.count), 0);
}

/**
 * The router's effect, in dots: every tool in the catalog, with only the ones
 * the orchestrator actually sees lit. "Router miss" drops one service, then
 * shows the escape hatch loading it mid-run.
 */
export function ToolGrid() {
  const [i, setI] = useState(0);
  const [miss, setMiss] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const req = REQUESTS[i];

  const active = miss && !recovered ? req.services.filter((s) => s !== req.miss) : req.services;
  const seen = visibleTools(active) + 1; // + the escape-hatch tool

  useEffect(() => {
    if (!miss) return;
    const id = window.setTimeout(() => setRecovered(true), 1600);
    return () => window.clearTimeout(id);
  }, [miss, i]);

  return (
    <div className="grid gap-4 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5">
      <div className="flex flex-wrap gap-2">
        {REQUESTS.map((r, n) => (
          <button
            key={r.text}
            type="button"
            onClick={() => {
              setI(n);
              setRecovered(false);
            }}
            className={clsx(
              "rounded-full px-3 py-1.5 text-left text-[13px] transition-colors",
              n === i ? "bg-ink text-white" : "bg-card text-ink-2 hover:bg-blue-fill hover:text-blue",
            )}
          >
            {r.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="flex items-baseline gap-2 font-mono text-[13px] text-muted">
          tools in context
          <span className="text-[26px] tracking-[-0.02em] text-ink">
            <NumberFlow value={seen} />
          </span>
          of {TOTAL}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
          <input
            type="checkbox"
            checked={miss}
            onChange={(e) => {
              setMiss(e.target.checked);
              setRecovered(false);
            }}
            className="accent-[var(--color-blue)]"
          />
          Simulate a router miss
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const on = active.includes(s.id);
          const loaded = miss && recovered && s.id === req.miss;
          const lit = s.id === "github" && on ? GITHUB_CORE : on ? s.count : 0;
          return (
            <div key={s.id} className={clsx("grid gap-1.5", s.id === "github" && "sm:col-span-2")}>
              <p className="flex items-baseline justify-between font-mono text-[11.5px]">
                <span className={on ? "text-ink-2" : "text-faint"}>
                  {s.label}
                  {loaded && <span className="ml-2 text-blue">← loaded via request_additional_tools</span>}
                  {miss && !recovered && s.id === req.miss && <span className="ml-2 text-[#c0392b]">missed by router</span>}
                </span>
                <span className="text-faint">{s.id === "github" && on ? `core ${GITHUB_CORE} of ${s.count}` : s.count}</span>
              </p>
              <div className="flex flex-wrap gap-[3px]" aria-hidden="true">
                {Array.from({ length: s.count }, (_, d) => (
                  <i
                    key={d}
                    className={clsx(
                      "block size-[7px] rounded-[2px] transition-colors duration-500",
                      d < lit ? (loaded ? "bg-ok" : "bg-blue") : "bg-line",
                    )}
                    style={{ transitionDelay: `${(d % 30) * 8}ms` }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-[11px] text-faint">
        Tool counts are exact, from the repo. The routes are examples of what the router picks for each request.
      </p>
    </div>
  );
}
