"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import clsx from "clsx";

type Rec = { v: number; status: string; files: string[] };
type Step = { who: "A" | "B"; text: string; rec?: Rec; wait?: boolean; bad?: boolean };

const V1: Rec = { v: 1, status: "draft", files: ["srv/catalog.cds"] };

// Agent A approves the change in SAP; agent B adds a file in Perforce.
// Both act on change #4821. Record contents are illustrative.
const UNLOCKED: Step[] = [
  { who: "A", text: "reads #4821 (v1)" },
  { who: "B", text: "reads #4821 (v1)" },
  { who: "A", text: "sets status → approved, writes v2", rec: { v: 2, status: "approved", files: ["srv/catalog.cds"] } },
  {
    who: "B",
    text: "adds a file to its v1 copy, writes v2",
    rec: { v: 2, status: "draft", files: ["srv/catalog.cds", "srv/api.cds"] },
    bad: true,
  },
];
const LOCKED: Step[] = [
  { who: "A", text: "locks #4821, reads v1" },
  { who: "B", text: "asks for the lock, waits", wait: true },
  { who: "A", text: "sets status → approved, writes v2, unlocks", rec: { v: 2, status: "approved", files: ["srv/catalog.cds"] } },
  { who: "B", text: "gets the lock, reads v2" },
  { who: "B", text: "adds a file, writes v3, unlocks", rec: { v: 3, status: "approved", files: ["srv/catalog.cds", "srv/api.cds"] } },
];

const STEP_MS = 1100;

/**
 * Two agents change the same record at the same time. Without a lock the
 * second write erases the first; with an entity-level lock it waits its turn.
 */
export function LockRace() {
  const [locked, setLocked] = useState(false);
  const [step, setStep] = useState(-1); // index of the last shown step
  const [playing, setPlaying] = useState(false);
  const steps = locked ? LOCKED : UNLOCKED;
  const done = step >= steps.length - 1;
  const running = playing && !done;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step < 0 ? 150 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, step]);

  const rec = steps
    .slice(0, step + 1)
    .reduce<Rec>((r, s) => s.rec ?? r, V1);
  const lost = done && !locked;

  const toggle = (on: boolean) => {
    setLocked(on);
    setStep(-1);
    setPlaying(false);
  };

  return (
    <div className="grid gap-5 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Locking" className="flex w-fit rounded-full bg-card p-1">
          {[false, true].map((on) => (
            <button
              key={String(on)}
              role="tab"
              aria-selected={locked === on}
              onClick={() => toggle(on)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background-color,color] duration-200",
                locked === on ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-muted hover:text-blue",
              )}
            >
              {on ? "Entity lock" : "No lock"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (done) setStep(-1);
            setPlaying(true);
          }}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white transition-[scale,opacity] active:scale-[0.97] disabled:opacity-50"
        >
          {done ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
          {done ? "Replay" : "Play"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:gap-6">
        <ol className="grid content-start gap-2">
          {steps.map((s, i) => {
            const shown = i <= step;
            return (
              <li
                key={`${locked}-${i}`}
                className={clsx(
                  "grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-[10px] px-3 py-2 text-[13.5px] transition-[opacity,background-color] duration-300",
                  !shown && "opacity-25",
                  shown && s.bad ? "bg-[#fbe9e5] text-ink" : shown && s.wait ? "bg-[#fff6d6] text-ink" : "bg-card/70 text-ink-2",
                )}
              >
                <span className={clsx("font-mono text-[12px]", s.who === "A" ? "text-blue" : "text-bridge")}>agent {s.who}</span>
                <span>{s.text}</span>
              </li>
            );
          })}
        </ol>

        <figure className="grid content-start gap-2 rounded-[14px] bg-night p-4 font-mono text-[12px] text-night-ink">
          <figcaption className="flex justify-between text-night-ink/55">
            <span>change #4821</span>
            <span>v{rec.v}</span>
          </figcaption>
          <p>
            status: <span className={rec.status === "approved" ? "text-[#7fd6a3]" : "text-night-ink/80"}>{rec.status}</span>
          </p>
          <p>files:</p>
          {rec.files.map((f) => (
            <p key={f} className="pl-3 text-night-ink/80">
              {f}
            </p>
          ))}
          <p
            className={clsx(
              "mt-2 rounded-[8px] px-2 py-1.5 text-[11.5px] transition-opacity duration-300",
              done ? "opacity-100" : "opacity-0",
              lost ? "bg-[#ff453a]/20 text-[#ffb4ad]" : "bg-[#30d158]/15 text-[#7fd6a3]",
            )}
          >
            {lost ? "A's approval was lost" : "both changes kept"}
          </p>
        </figure>
      </div>
      <p className="font-mono text-[11px] text-faint">Simplified. The record and its fields are illustrative.</p>
    </div>
  );
}
