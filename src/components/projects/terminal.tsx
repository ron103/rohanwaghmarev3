"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Project, TermLine } from "@/content/projects";

type Entry = { kind: "cmd"; text: string } | ({ kind: "out" } & TermLine);

const tone: Record<NonNullable<TermLine["tone"]>, string> = {
  muted: "text-night-ink/50",
  ok: "text-[#7fd6a3]",
  accent: "text-night-blue",
  warn: "text-[#f0c66b]",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A small fake shell for a project. On mount (and when the project changes) it
 * types the demo command and streams its output; then the prompt is yours.
 */
export function Terminal({ project, onNext, onUserInput }: { project: Project; onNext: () => void; onUserInput: () => void }) {
  const [log, setLog] = useState<Entry[]>([]);
  const [typing, setTyping] = useState("");
  const [busy, setBusy] = useState(true);
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const run = useRef(0); // bumps on each new script so stale ones stop
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const play = async (lines: TermLine[], id: number, reduce: boolean) => {
    for (const l of lines) {
      if (run.current !== id) return;
      if (!reduce) await sleep(140 + Math.random() * 160);
      setLog((g) => [...g, { kind: "out", ...l }]);
    }
  };

  // Autoplay the demo whenever the project changes.
  useEffect(() => {
    const id = ++run.current;
    let alive = true;
    const live = () => alive && run.current === id;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      setLog([{ kind: "out", text: `${project.slug} · type "help" for commands`, tone: "muted" }]);
      setBusy(true);
      setTyping("");
      if (!reduce) await sleep(500);
      const cmd = project.demo.command;
      for (let i = 1; i <= cmd.length && !reduce; i++) {
        if (!live()) return;
        setTyping(cmd.slice(0, i));
        await sleep(22 + Math.random() * 30);
      }
      if (!live()) return;
      setTyping("");
      setLog((g) => [...g, { kind: "cmd", text: cmd }]);
      await play(project.demo.output, id, reduce);
      if (live()) setBusy(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [log, typing]);

  const exec = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    onUserInput();
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    const [name] = cmd.split(/\s+/);
    const out: TermLine[] = (() => {
      switch (name) {
        case "help":
          return [
            { text: "run      replay this project's demo" },
            { text: "about    what this project is" },
            { text: "ls       list projects" },
            { text: "open     open the code or paper" },
            { text: "next     show the next project" },
            { text: "clear    clear the screen" },
          ];
        case "ls":
          return [{ text: "orchestrator  tb-detection  polymarket-bot", tone: "accent" }];
        case "about":
          return [{ text: project.description }];
        case "open":
          if (!project.links[0]) return [{ text: "nothing public yet", tone: "warn" }];
          window.open(project.links[0].href, "_blank", "noopener");
          return [{ text: `opening ${project.links[0].href}`, tone: "ok" }];
        case "sudo":
          return [{ text: "nice try. permission granted to email me though.", tone: "warn" }];
        default:
          return [{ text: `command not found: ${name} · try "help"`, tone: "warn" }];
      }
    })();

    if (name === "clear") return setLog([]);
    if (name === "next") return onNext();
    setLog((g) => [...g, { kind: "cmd", text: cmd }]);
    if (name === "run") {
      const id = ++run.current;
      setBusy(true);
      await play(project.demo.output, id, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (run.current === id) setBusy(false);
      return;
    }
    setLog((g) => [...g, ...out.map((o) => ({ kind: "out" as const, ...o }))]);
  };

  return (
    <div
      className="flex h-[380px] flex-col overflow-hidden rounded-[18px] bg-night text-night-ink shadow-[0_24px_50px_-28px_rgba(18,21,42,0.6)]"
      onClick={() => input.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px] text-night-ink/55">
        <i className="size-2 rounded-full bg-white/15" />
        <i className="size-2 rounded-full bg-white/15" />
        <i className="size-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate">~/projects/{project.slug}</span>
      </div>
      <div ref={scroller} aria-live="polite" className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-[1.75]">
        {log.map((e, i) =>
          e.kind === "cmd" ? (
            <p key={i} className="whitespace-pre-wrap break-words">
              <span className="text-night-blue">❯ </span>
              {e.text}
            </p>
          ) : (
            <p key={i} className={clsx("whitespace-pre-wrap break-words", e.tone ? tone[e.tone] : "text-night-ink/85")}>
              {e.text}
            </p>
          ),
        )}
        {busy && typing && (
          <p className="whitespace-pre-wrap break-words">
            <span className="text-night-blue">❯ </span>
            {typing}
            <i className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] animate-[caret_1s_steps(1)_infinite] bg-night-ink/80" />
          </p>
        )}
        {!busy && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              exec(draft);
              setDraft("");
            }}
            className="flex items-center"
          >
            <label htmlFor={`term-${project.slug}`} className="text-night-blue">
              ❯&nbsp;
            </label>
            <input
              ref={input}
              id={`term-${project.slug}`}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                onUserInput();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && history.length) {
                  e.preventDefault();
                  const n = Math.min(hIdx + 1, history.length - 1);
                  setHIdx(n);
                  setDraft(history[n]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const n = Math.max(hIdx - 1, -1);
                  setHIdx(n);
                  setDraft(n === -1 ? "" : history[n]);
                }
              }}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
              placeholder="help"
              className="term-input min-w-0 flex-1 bg-transparent text-night-ink caret-night-blue outline-none placeholder:text-night-ink/25"
            />
          </form>
        )}
      </div>
    </div>
  );
}
