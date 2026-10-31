"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import clsx from "clsx";
import { OrgLogo } from "../org-logo";

type Span = { name: string; start: number; dur: number; label: string; hot?: boolean };

// Seconds on a 0–90s axis. Before: three GPT hops. After: preprocess + two adapters.
const before: Span[] = [
  { name: "gpt · hop 1", start: 0, dur: 31, label: "31s" },
  { name: "gpt · hop 2", start: 31, dur: 27, label: "27s" },
  { name: "gpt · hop 3", start: 58, dur: 32, label: "32s" },
];
const after: Span[] = [
  { name: "preprocess", start: 0, dur: 0.4, label: "0.4s" },
  { name: "extract adapter", start: 0.4, dur: 4.1, label: "4.1s" },
  { name: "classify adapter", start: 4.5, dur: 6.5, label: "6.5s", hot: true },
];
const AXIS = 90;

/** Plays once when scrolled into view; each hover replays it. */
function useReplay() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun((r) => (r === 0 ? 1 : r));
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, run, replay: () => setRun((r) => r + 1) };
}

function Row({ span, kind, run, delay }: { span: Span; kind: "before" | "after"; run: number; delay: number }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)_38px] md:grid-cols-[112px_minmax(0,1fr)_44px] items-center gap-3">
      <span className="truncate">{span.name}</span>
      <span className="relative block h-3">
        <i
          key={run}
          className={clsx(
            "absolute top-0 h-3 origin-left rounded-[3px]",
            run > 0 && "animate-[span-grow_.8s_var(--ease-out-soft)_both]",
            run === 0 && "scale-x-0",
            kind === "before"
              ? "bg-[repeating-linear-gradient(135deg,#c4c6be_0_1.5px,transparent_1.5px_5px)] shadow-[inset_0_0_0_1px_#c4c6be]"
              : span.hot
                ? "bg-blue"
                : "bg-blue/20 shadow-[inset_0_0_0_1px_rgb(47_63_209/0.55)]",
          )}
          style={{
            left: `${(span.start / AXIS) * 100}%`,
            width: `max(3px, ${(span.dur / AXIS) * 100}%)`,
            animationDelay: `${delay}ms`,
          }}
        />
      </span>
      <em className="text-right not-italic tabular-nums text-ink-2">{span.label}</em>
    </div>
  );
}

function Trace({ run }: { run: number }) {
  return (
    <div
      aria-label="Request trace: three GPT hops took 90 seconds; two fine-tuned adapters take 11 seconds."
      role="img"
      className="grid content-center gap-2 rounded-[14px] bg-white p-4 font-mono text-[11px] text-muted shadow-[inset_0_0_0_1px_var(--color-line)] md:p-5"
    >
      <div className="mb-1 flex justify-between text-ink-2">
        <span>trace · classify_change</span>
        <span>p95</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.08em] text-faint">before</p>
      {before.map((s, i) => (
        <Row key={s.name} span={s} kind="before" run={run} delay={i * 140} />
      ))}
      <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-faint">after</p>
      {after.map((s, i) => (
        <Row key={s.name} span={s} kind="after" run={run} delay={520 + i * 160} />
      ))}
      <div className="mt-1 grid grid-cols-[96px_minmax(0,1fr)_38px] md:grid-cols-[112px_minmax(0,1fr)_44px] gap-3 text-faint">
        <span />
        <span className="flex justify-between">
          <span>0s</span>
          <span>45s</span>
          <span>90s</span>
        </span>
        <span />
      </div>
    </div>
  );
}

function Metric({ from, to, run, suffix, caption, struck }: { from: number; to: number; run: number; suffix: string; caption: string; struck?: string }) {
  return (
    <div>
      <dd className="flex items-baseline gap-2 font-mono text-[26px] tracking-[-0.02em]">
        {struck && (
          <>
            <s className="text-[18px] text-faint">{struck}</s>
            <span className="text-[18px] text-blue">→</span>
          </>
        )}
        <NumberFlow
          value={run > 0 ? to : from}
          suffix={suffix}
          transformTiming={{ duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          spinTiming={{ duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </dd>
      <dt className="text-[12.5px] text-muted">{caption}</dt>
    </div>
  );
}

export function WorkCard() {
  const { ref, run, replay } = useReplay();
  // Numbers jump back to their start for a beat, then roll forward again on each replay.
  const [reset, setReset] = useState(false);
  const shown = reset ? 0 : run;

  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href="/work/sap"
      prefetch
      data-cursor="open case study"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || run === 0) return;
        setReset(true);
        window.setTimeout(() => {
          setReset(false);
          replay();
        }, 60);
      }}
      className="group grid grid-cols-1 gap-8 rounded-[20px] bg-card p-6 transition-colors duration-200 hover:bg-card-2 md:grid-cols-2 md:gap-10 md:px-10 md:pb-10 md:pt-8"
    >
      <div className="grid min-w-0 content-start gap-3">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-ink-2">
          <OrgLogo org="sap" size={20} />
          SAP Labs US
          <span className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted">LLM · 2026</span>
        </p>
        <h3 className="font-serif text-[clamp(28px,3vw,34px)] font-light leading-[1.08] tracking-[-0.015em]">
          Replacing a GPT pipeline with <span className="mark">models we own</span>.
        </h3>
        <p className="text-muted">Two QLoRA adapters on DeepSeek-R1 14B, served through vLLM.</p>
        <dl className="mt-4 flex flex-wrap gap-x-9 gap-y-4">
          <Metric struck="90s" from={90} to={11} suffix="s" run={shown} caption="p95 latency" />
          <Metric from={1} to={10} suffix="×" run={shown} caption="cheaper inference" />
          <Metric from={0} to={98} suffix="%" run={shown} caption="accuracy" />
        </dl>
        <span className="mt-4 text-[15px] font-medium text-ink-2 transition-colors group-hover:text-blue">Read the case study →</span>
      </div>
      <Trace run={run} />
    </Link>
  );
}
