import type { Org } from "@/components/org-logo";

// The two Work cards on the home page.

export type Span = { name: string; start: number; dur: number; label: string; hot?: boolean };
export type MetricData = { from: number; to: number; suffix: string; caption: string; struck?: string };

export type WorkCardData = {
  href: string;
  org: Org;
  company: string;
  badge: string;
  title: [before: string, marked: string, after: string];
  sub: string;
  metrics: MetricData[];
  trace: { heading: string; unit: string; axis: number; ticks: [string, string, string]; label: string; before: Span[]; after: Span[] };
};

// Real totals from the resume; per-step splits are illustrative (as on the case pages).
export const workCards: WorkCardData[] = [
  {
    href: "/work/sap",
    org: "sap",
    company: "SAP",
    badge: "LLM · 2026",
    title: ["Replacing a GPT pipeline with ", "models we own", "."],
    sub: "Two QLoRA adapters on DeepSeek-R1 14B, served through vLLM.",
    metrics: [
      { struck: "90s", from: 90, to: 11, suffix: "s", caption: "p95 latency" },
      { from: 1, to: 10, suffix: "×", caption: "cheaper inference" },
      { from: 0, to: 98, suffix: "%", caption: "accuracy" },
    ],
    trace: {
      heading: "trace · classify_change",
      label: "Request trace: three GPT hops took 90 seconds; two fine-tuned adapters take 11 seconds.",
      unit: "p95",
      axis: 90,
      ticks: ["0s", "45s", "90s"],
      before: [
        { name: "gpt · hop 1", start: 0, dur: 31, label: "31s" },
        { name: "gpt · hop 2", start: 31, dur: 27, label: "27s" },
        { name: "gpt · hop 3", start: 58, dur: 32, label: "32s" },
      ],
      after: [
        { name: "preprocess", start: 0, dur: 0.4, label: "0.4s" },
        { name: "extract adapter", start: 0.4, dur: 4.1, label: "4.1s" },
        { name: "classify adapter", start: 4.5, dur: 6.5, label: "6.5s", hot: true },
      ],
    },
  },
  {
    href: "/work/mihin",
    org: "mihin",
    company: "MiHIN",
    badge: "Data · 2025",
    title: ["Getting healthcare data ", "where it needs to go", "."],
    sub: "Parallel byte-range reads from S3, parsed as they land.",
    metrics: [
      { from: 0, to: 40, suffix: "%", caption: "faster on multi-GB files" },
      { from: 0, to: 500, suffix: "K+", caption: "records ingested" },
      { from: 0, to: 10, suffix: "+", caption: "healthcare orgs" },
    ],
    trace: {
      heading: "trace · ingest_file",
      label: "Ingestion trace: downloading then parsing took the whole run; ranged parallel reads finish 40% sooner.",
      unit: "% of old run",
      axis: 100,
      ticks: ["0%", "50%", "100%"],
      before: [
        { name: "download file", start: 0, dur: 55, label: "55%" },
        { name: "parse serially", start: 55, dur: 45, label: "45%" },
      ],
      after: [
        { name: "trigger", start: 0, dur: 2, label: "2%" },
        { name: "ranged reads", start: 2, dur: 30, label: "30%" },
        { name: "parse parallel", start: 12, dur: 48, label: "48%", hot: true },
      ],
    },
  },
];
