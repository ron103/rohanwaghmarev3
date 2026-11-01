"use client";

import { useState } from "react";
import clsx from "clsx";

// How the stored post grew as the team found new signals. Field names are
// simplified for the page.
const STEPS = [
  {
    when: "Week 1",
    label: "Raw posts",
    fields: [
      ["source", '"reddit"'],
      ["community", '"r/jobs"'],
      ["title", '"Laid off after 6 years, what now?"'],
      ["created_utc", "1730419200"],
      ["score", "412"],
    ],
    note: "Reddit JSON and scraped 4chan HTML land in the same collection.",
  },
  { when: "Week 2", label: "+ toxicity", fields: [["toxicity", '{ "class": "normal", "confidence": 0.91 }']], note: "ModerateHateSpeech scores every post." },
  { when: "Week 3", label: "+ sentiment", fields: [["sentiment", '{ "vader": -0.62, "weighted": -0.48 }']], note: "VADER polarity, weighted by engagement." },
  {
    when: "Week 5",
    label: "+ emotional relevance",
    fields: [["emotional_relevance", "0.73"]],
    note: "The signal that disproved the team's starting hypothesis.",
  },
] as const;

/**
 * One stored document, growing a field at a time. In Mongo each step was a
 * two-line change; in SQL each would have been a migration, a backfill and a
 * worker restart.
 */
export function SchemaEvolution() {
  const [step, setStep] = useState(STEPS.length - 1);
  const shown = STEPS.slice(0, step + 1).flatMap((s, n) => s.fields.map((f) => ({ f, n })));

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:gap-6">
      <figure className="min-w-0 overflow-hidden rounded-[16px] bg-night text-night-ink">
        <figcaption className="border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px] text-night-ink/55">
          db.reddit_posts.findOne()
        </figcaption>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.8]">
          <span>{"{"}</span>
          {shown.map(({ f: [k, v], n }) => (
            <div
              key={k}
              className={clsx(
                "-mx-4 px-4 transition-colors duration-500",
                n === step && step > 0 ? "animate-[token-in_.5s_var(--ease-out-soft)_both] bg-[#8c98ff]/15" : "",
              )}
            >
              {"  "}
              <span className="text-night-blue">{k}</span>: <span className="text-night-ink/85">{v}</span>,
            </div>
          ))}
          <span>{"}"}</span>
        </pre>
      </figure>
      <ol className="grid content-start gap-2">
        {STEPS.map((s, n) => (
          <li key={s.when}>
            <button
              type="button"
              onClick={() => setStep(n)}
              aria-pressed={n === step}
              className={clsx(
                "grid w-full gap-0.5 rounded-[12px] px-3 py-2.5 text-left transition-colors",
                n === step ? "bg-blue-fill" : n < step ? "bg-card" : "bg-card/50 hover:bg-card",
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className={clsx("text-[14px] font-semibold", n <= step ? "text-ink-2" : "text-faint")}>{s.label}</span>
                <span className="font-mono text-[11px] text-faint">{s.when}</span>
              </span>
              <span className="text-[12.5px] leading-snug text-muted">{s.note}</span>
            </button>
          </li>
        ))}
        <li className="px-1 pt-1 font-mono text-[11px] leading-relaxed text-faint">Mongo: add a field. SQL: migrate, backfill, restart workers.</li>
      </ol>
    </div>
  );
}
