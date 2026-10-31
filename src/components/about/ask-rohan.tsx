"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import clsx from "clsx";

export type QA = { q: string; a: string; keywords: string[] };

type Msg = { from: "you" | "rohan"; text: string; shown: number };

const FALLBACK =
  "I don't have a good answer for that one saved yet. Email me and I'll answer it properly, then it'll live here.";

function answerFor(input: string, qas: QA[]) {
  const t = input.toLowerCase();
  let best: QA | null = null;
  let score = 0;
  for (const qa of qas) {
    const s = qa.keywords.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
    if (s > score) [best, score] = [qa, s];
  }
  return best?.a ?? FALLBACK;
}

/**
 * A small Q&A box. Answers are canned for now and stream in word by word.
 * Later this can be swapped for a real retrieval call over the resume.
 */
export function AskRohan({ qas }: { qas: QA[] }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const streaming = msgs.some((m) => m.from === "rohan" && m.shown < m.text.split(" ").length);

  // Stream the newest answer.
  useEffect(() => {
    const last = msgs[msgs.length - 1];
    if (!last || last.from !== "rohan") return;
    const total = last.text.split(" ").length;
    if (last.shown >= total) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(
      () => setMsgs((ms) => ms.map((m, i) => (i === ms.length - 1 ? { ...m, shown: reduce ? total : m.shown + 1 } : m))),
      last.shown === 0 ? 380 : 28 + Math.random() * 50,
    );
    return () => window.clearTimeout(id);
  }, [msgs]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim() || streaming) return;
    setMsgs((ms) => [...ms, { from: "you", text: q.trim(), shown: Infinity }, { from: "rohan", text: answerFor(q, qas), shown: 0 }]);
    setDraft("");
  };

  const unasked = qas.filter((qa) => !msgs.some((m) => m.from === "you" && m.text === qa.q));

  return (
    <div className="grid gap-3 rounded-[20px] bg-card p-3 shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div ref={log} aria-live="polite" className="grid max-h-[340px] min-h-[120px] content-start gap-3 overflow-y-auto p-2">
        {msgs.length === 0 && (
          <p className="text-[15px] text-muted">
            Ask me something. These answers are written by me, not generated, at least for now.
          </p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={clsx("max-w-[85%] text-[15px] leading-relaxed", m.from === "you" ? "justify-self-end" : "justify-self-start")}>
            {m.from === "you" ? (
              <p className="rounded-[14px] rounded-br-[4px] bg-ink px-3.5 py-2 text-white">{m.text}</p>
            ) : (
              <p className="rounded-[14px] rounded-bl-[4px] bg-white px-3.5 py-2 text-ink-2 shadow-[0_0_0_1px_var(--color-line)]">
                {m.shown === 0 ? (
                  <span className="inline-flex gap-1 py-1.5" aria-label="Thinking">
                    {[0, 1, 2].map((d) => (
                      <i key={d} className="block size-1.5 animate-[caret_1s_steps(1)_infinite] rounded-full bg-faint" style={{ animationDelay: `${d * 160}ms` }} />
                    ))}
                  </span>
                ) : (
                  m.text.split(" ").slice(0, m.shown).join(" ")
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {unasked.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {unasked.slice(0, 4).map((qa) => (
            <button
              key={qa.q}
              type="button"
              disabled={streaming}
              onClick={() => ask(qa.q)}
              className="rounded-full bg-white px-3 py-1.5 text-[13.5px] text-ink-2 shadow-[0_0_0_1px_var(--color-line)] transition-[background-color,color,scale] duration-150 hover:bg-blue-fill hover:text-blue active:scale-[0.97] disabled:opacity-50"
            >
              {qa.q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
        className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-[0_0_0_1px_var(--color-line)]"
      >
        <label htmlFor="ask-rohan" className="sr-only">
          Ask Rohan a question
        </label>
        <input
          id="ask-rohan"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about my work, tools, or anything"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!draft.trim() || streaming}
          className="grid size-9 place-items-center rounded-full bg-ink text-white transition-[opacity,scale] active:scale-95 disabled:opacity-30"
        >
          <ArrowUp className="size-4" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
