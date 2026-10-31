"use client";

import { useState } from "react";
import clsx from "clsx";
import type { CodeLine } from "@/content/work";

/**
 * A code snippet whose highlighted lines carry margin notes. Hover or focus a
 * line to read its note; on small screens the note shows under the code.
 */
export function AnnotatedCode({ file, lines }: { file: string; lines: CodeLine[] }) {
  const firstNote = lines.findIndex((l) => l.note);
  const [active, setActive] = useState(firstNote);
  const note = lines[active]?.note;

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px] md:gap-6">
      <figure className="min-w-0 overflow-hidden rounded-[16px] bg-night text-night-ink">
        <figcaption className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px] text-night-ink/55">
          <i className="size-2 rounded-full bg-white/15" />
          <i className="size-2 rounded-full bg-white/15" />
          <i className="size-2 rounded-full bg-white/15" />
          <span className="ml-2">{file}</span>
        </figcaption>
        <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-[1.75]">
          {lines.map((l, i) => (
            <div
              key={i}
              tabIndex={l.note ? 0 : -1}
              onPointerEnter={() => l.note && setActive(i)}
              onFocus={() => l.note && setActive(i)}
              data-cursor={l.note ? "why this line?" : undefined}
              className={clsx(
                "grid grid-cols-[32px_minmax(0,1fr)] pr-4 outline-none",
                l.note && (active === i ? "bg-[#8c98ff]/18" : "bg-[#8c98ff]/6 hover:bg-[#8c98ff]/12 focus-visible:bg-[#8c98ff]/12"),
              )}
            >
              <span className="select-none pr-3 text-right text-night-ink/30">{i + 1}</span>
              <code className={clsx("whitespace-pre", l.note ? "text-night-ink" : "text-night-ink/75")}>{l.text || " "}</code>
            </div>
          ))}
        </pre>
      </figure>
      <aside aria-live="polite" className="relative md:pt-12">
        {note && (
          <p key={active} className="animate-[token-in_.3s_var(--ease-out-soft)_both] border-l-2 border-blue pl-3 text-[14px] leading-relaxed text-ink-2">
            <span className="mb-1 block font-mono text-[11px] text-blue">line {active + 1}</span>
            {note}
          </p>
        )}
      </aside>
    </div>
  );
}

