"use client";

import { useState } from "react";
import clsx from "clsx";

// An illustrative slice of the developer knowledge graph.
const NODES = {
  api: { x: 110, y: 60, label: "/invoices API" },
  service: { x: 320, y: 60, label: "billing service" },
  team: { x: 530, y: 60, label: "Team Ledger" },
  incident: { x: 110, y: 160, label: "INC: timeouts" },
  pkg: { x: 320, y: 160, label: "cap-billing pkg" },
  depot: { x: 530, y: 160, label: "//depot/billing" },
  runbook: { x: 110, y: 260, label: "Timeout runbook" },
  doc: { x: 320, y: 260, label: "Design doc" },
} as const;
type Id = keyof typeof NODES;

const EDGES: [Id, Id, string][] = [
  ["api", "service", "exposedBy"],
  ["service", "team", "ownedBy"],
  ["service", "pkg", "builtFrom"],
  ["pkg", "depot", "storedAt"],
  ["api", "incident", "affectedBy"],
  ["incident", "runbook", "resolvedBy"],
  ["service", "doc", "documentedIn"],
];

const QUESTIONS: { q: string; path: Id[]; sparql: string[]; answer: string }[] = [
  {
    q: "Who owns the /invoices API?",
    path: ["api", "service", "team"],
    sparql: ["SELECT ?team WHERE {", "  :invoicesApi :exposedBy ?svc .", "  ?svc :ownedBy ?team .", "}"],
    answer: "Team Ledger, via the billing service.",
  },
  {
    q: "Where does billing's code live?",
    path: ["service", "pkg", "depot"],
    sparql: ["SELECT ?path WHERE {", "  :billing :builtFrom ?pkg .", "  ?pkg :storedAt ?path .", "}"],
    answer: "//depot/billing, in the cap-billing package.",
  },
  {
    q: "Is there a runbook for invoice timeouts?",
    path: ["api", "incident", "runbook"],
    sparql: ["SELECT ?doc WHERE {", "  :invoicesApi :affectedBy ?inc .", "  ?inc :resolvedBy ?doc .", "}"],
    answer: "Yes: the timeout runbook, linked from the incident.",
  },
];

const W = 112;
const H = 34;

/** Pick a question and watch the SPARQL path light up through the graph. */
export function KgQuery() {
  const [n, setN] = useState(0);
  const q = QUESTIONS[n];
  const onPath = (a: Id, b: Id) => {
    const i = q.path.indexOf(a);
    const j = q.path.indexOf(b);
    return i >= 0 && j >= 0 && Math.abs(i - j) === 1;
  };

  return (
    <div className="grid gap-4 rounded-[18px] bg-white p-4 shadow-[inset_0_0_0_1px_var(--color-line)] md:p-6">
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((x, i) => (
          <button
            key={x.q}
            type="button"
            onClick={() => setN(i)}
            aria-pressed={i === n}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
              i === n ? "bg-blue text-white" : "bg-card text-ink-2 hover:text-blue",
            )}
          >
            {x.q}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <div className="min-w-0 overflow-x-auto">
          <svg viewBox="0 0 640 310" className="block w-full min-w-[480px]" role="img" aria-label={`Graph path for: ${q.q}`}>
            {EDGES.map(([a, b, label]) => {
              const A = NODES[a];
              const B = NODES[b];
              const hot = onPath(a, b);
              return (
                <g key={`${a}-${b}`}>
                  <line
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={hot ? "var(--color-blue)" : "var(--color-line)"}
                    strokeWidth={hot ? 2.5 : 1.5}
                    className="transition-[stroke] duration-300"
                  />
                  <text
                    x={(A.x + B.x) / 2 + (A.y === B.y ? 0 : 8)}
                    y={(A.y + B.y) / 2 + (A.y === B.y ? -6 : 4)}
                    textAnchor={A.y === B.y ? "middle" : "start"}
                    className={clsx("font-mono text-[10px] transition-[fill]", hot ? "fill-[var(--color-blue)]" : "fill-[var(--color-faint)]")}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            {(Object.keys(NODES) as Id[]).map((id) => {
              const nd = NODES[id];
              const hot = q.path.includes(id);
              const end = q.path.at(-1) === id;
              return (
                <g key={id} transform={`translate(${nd.x - W / 2} ${nd.y - H / 2})`}>
                  <rect
                    width={W}
                    height={H}
                    rx="10"
                    fill={end ? "var(--color-blue)" : hot ? "var(--color-blue-fill)" : "#fff"}
                    stroke={hot ? "var(--color-blue)" : "var(--color-line)"}
                    strokeWidth="1.5"
                    className="transition-[fill,stroke] duration-300"
                  />
                  <text
                    x={W / 2}
                    y={H / 2 + 4}
                    textAnchor="middle"
                    className={clsx("text-[11.5px] font-medium", end ? "fill-white" : hot ? "fill-[var(--color-ink)]" : "fill-[var(--color-muted)]")}
                  >
                    {nd.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6">
          <pre className="overflow-x-auto rounded-[12px] bg-night px-3.5 py-3 font-mono text-[11.5px] leading-[1.7] text-night-ink">
            {q.sparql.join("\n")}
          </pre>
          <p className="text-[15px] leading-relaxed text-ink-2">
            <span className="mr-2 font-mono text-[11px] text-faint">answer</span>
            {q.answer}
          </p>
        </div>
      </div>
      <p className="font-mono text-[11px] text-faint">An illustrative slice of the graph. The real one is much bigger.</p>
    </div>
  );
}
