// Projects shown on /projects. Terminal output is a scripted demo, not a live run.

export type TermLine = { text: string; tone?: "muted" | "ok" | "accent" | "warn" };

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  description: string;
  stack: string[];
  metrics: { value: string; caption: string }[];
  links: { label: string; href: string }[];
  status?: string;
  demo: { command: string; output: TermLine[] };
};

export const projects: Project[] = [
  {
    slug: "orchestrator",
    title: "Agentic Tool Orchestrator",
    oneLiner: "An agent router across 191 tools in 7 services.",
    description:
      "One model can't hold 191 tool schemas in context and still pick well. The orchestrator routes each request to the right service first, then exposes only that service's tools. Instruction-following went from 50% to 100% and context shrank by 40%.",
    stack: ["Python", "FastAPI", "OpenAI API"],
    metrics: [
      { value: "50% → 100%", caption: "instruction-following" },
      { value: "−40%", caption: "context per call" },
      { value: "24", caption: "end-to-end tests" },
    ],
    links: [{ label: "Code", href: "https://github.com/ron103/Agentic-Tool-Orchestrator" }],
    demo: {
      command: 'orchestrator run "book a flight to SFO on Friday"',
      output: [
        { text: "→ routing across 7 services, 191 tools", tone: "muted" },
        { text: "  router picked: travel (0.94)", tone: "accent" },
        { text: "  exposing 23 of 191 tools", tone: "muted" },
        { text: "→ search_flights(to=SFO, date=2026-11-06)" },
        { text: "  3 options found" },
        { text: "→ hold_seat(flight=UA 1542)" },
        { text: "  circuit breaker: travel-api healthy", tone: "muted" },
        { text: "✓ seat held · 2 tool calls · 1.8s", tone: "ok" },
      ],
    },
  },
  {
    slug: "tb-detection",
    title: "TB detection",
    oneLiner: "92% on TBX11K with ResNet-50. Published at IEEE.",
    description:
      "Transfer learning on chest X-rays to flag tuberculosis. CLAHE preprocessing and augmentation got ResNet-50 to 92% accuracy on TBX11K, checked with Grad-CAM so the model was looking at lungs, not labels. Co-authored an IEEE paper reviewing 60+ studies.",
    stack: ["TensorFlow", "ResNet-50", "Python"],
    metrics: [
      { value: "92%", caption: "accuracy on TBX11K" },
      { value: "60+", caption: "studies reviewed" },
      { value: "IEEE", caption: "published" },
    ],
    links: [{ label: "Paper", href: "https://ieeexplore.ieee.org/document/10112352" }],
    demo: {
      command: "tb-detect predict chest_xray_0412.png --gradcam",
      output: [
        { text: "→ preprocessing: CLAHE, resize 224×224", tone: "muted" },
        { text: "→ resnet50 (imagenet → tbx11k fine-tuned)", tone: "muted" },
        { text: "  P(tuberculosis) = 0.91", tone: "accent" },
        { text: "  grad-cam focus: upper right lobe" },
        { text: "✓ flagged for radiologist review", tone: "ok" },
      ],
    },
  },
  {
    slug: "polymarket-bot",
    title: "Polymarket bot",
    oneLiner: "A trading agent for prediction markets.",
    description:
      "A side project that watches prediction markets, estimates fair odds, and places small bets when the gap is big enough. Mostly an excuse to learn about market microstructure and to see how wrong my priors are.",
    stack: ["Python", "LLM agents"],
    metrics: [{ value: "WIP", caption: "learning in public" }],
    links: [],
    status: "In progress",
    demo: {
      command: "polybot scan --min-edge 0.05",
      output: [
        { text: "→ scanning 412 open markets", tone: "muted" },
        { text: "  fair-odds model: news + base rates", tone: "muted" },
        { text: "  2 markets with edge ≥ 5%", tone: "accent" },
        { text: "! paper-trading mode, no real orders", tone: "warn" },
        { text: "✓ logged 2 hypothetical positions", tone: "ok" },
      ],
    },
  },
];
