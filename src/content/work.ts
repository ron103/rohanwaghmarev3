import type { Org } from "@/components/org-logo";

// Case study content. Numbers come from Rohan's resume bullets; trace timings
// and per-step splits are illustrative and labelled as such on the page.

export type Stat = { value: string; from?: string; caption: string };

export type PipeNode = {
  id: string;
  label: string;
  sub?: string;
  x: number; // centre, in diagram units (viewBox 760 × 300)
  y: number;
  kind?: "io" | "llm" | "model" | "code" | "store";
  detail: string;
  secs?: number; // illustrative time spent in this step, for the Run animation
};
export type Pipeline = {
  nodes: PipeNode[];
  edges: [string, string, "dashed"?][];
  group?: { label: string; ids: string[] };
  timed?: boolean; // false when we have no real timings: Run shows progress, not seconds
};
export type PipelineView = { label: string; data: Pipeline };

export type Span = { name: string; start: number; dur: number };
export type Trace = { unit: string; axis: number; before: Span[]; after: Span[]; note: string };

export type CodeLine = { text: string; note?: string };

/** A smaller project from the same role, shown under "More" after the main story. */
export type MoreItem = { title: string; stats: Stat[]; text: string[]; stack: string[] };

type Base = { id: string; title: string; body: string[] };

export type Section =
  | (Base & { kind?: "text" })
  | (Base & { kind: "toolgrid" | "schema" | "sentiment" | "watch" | "funnel" | "papers" })
  | (Base & { kind: "placeholder"; label: string })
  | { id: string; title: string; body: string[]; kind: "pipeline" }
  | { id: string; title: string; body: string[]; kind: "trace" }
  | { id: string; title: string; body: string[]; kind: "code"; code: { file: string; lines: CodeLine[] } }
  | { id: string; title: string; body: string[]; kind: "list"; items: { title: string; text: string }[] }
  | (Base & { kind: "more"; items: MoreItem[] });

export type CaseStudy = {
  slug: string;
  company: string; // the organization, or the project name for projects
  logo?: Org;
  badge?: string;
  role: string;
  timeline: string;
  place: string;
  scope: string;
  title: [before: string, marked: string, after: string];
  lede: string;
  stats: Stat[];
  views: PipelineView[];
  trace?: Trace;
  sections: Section[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "sap",
    company: "SAP Labs US",
    logo: "sap",
    badge: "LLM · 2026",
    role: "Software Developer, AI",
    timeline: "Jan 2026 – Present",
    place: "Palo Alto, CA",
    scope: "Fine-tuning, serving, MLOps",
    title: ["Replacing a GPT pipeline with ", "models we own", "."],
    lede: "A three-hop external GPT chain was slow, expensive, and sent customer data outside our walls. I replaced it with two small fine-tuned models that run on one GPU.",
    stats: [
      { value: "11s", from: "90s", caption: "p95 latency" },
      { value: "10×", caption: "cheaper inference" },
      { value: "98%", caption: "classification accuracy" },
      { value: "3×", caption: "throughput on the same GPU" },
    ],
    views: [
      {
        label: "Before",
        data: {
          nodes: [
            {
              id: "in",
              label: "Change record",
              x: 70,
              y: 150,
              kind: "io",
              detail: "A configuration change ticket arrives, free text plus a few structured fields.",
              secs: 0,
            },
            {
              id: "h1",
              label: "GPT · hop 1",
              sub: "extract",
              x: 250,
              y: 150,
              kind: "llm",
              detail: "An external GPT call pulls entities out of the ticket. Data leaves our infrastructure here.",
              secs: 31,
            },
            {
              id: "h2",
              label: "GPT · hop 2",
              sub: "normalize",
              x: 410,
              y: 150,
              kind: "llm",
              detail: "A second GPT call cleans and normalizes what the first one extracted.",
              secs: 27,
            },
            {
              id: "h3",
              label: "GPT · hop 3",
              sub: "classify",
              x: 570,
              y: 150,
              kind: "llm",
              detail: "A third call classifies the change. Errors from hops 1 and 2 compound here.",
              secs: 32,
            },
            {
              id: "out",
              label: "Decision",
              x: 700,
              y: 150,
              kind: "io",
              detail: "About 90 seconds later at p95, a classification comes back.",
              secs: 0,
            },
          ],
          edges: [
            ["in", "h1"],
            ["h1", "h2"],
            ["h2", "h3"],
            ["h3", "out"],
          ],
        },
      },
      {
        label: "After",
        data: {
          nodes: [
            { id: "in", label: "Change record", x: 70, y: 110, kind: "io", detail: "Same input as before.", secs: 0 },
            {
              id: "pre",
              label: "Preprocess",
              sub: "deterministic",
              x: 220,
              y: 110,
              kind: "code",
              detail: "Normalization moved out of the model into plain code. Free, instant, and never hallucinates.",
              secs: 0.4,
            },
            {
              id: "ext",
              label: "Extract adapter",
              sub: "QLoRA · R1 14B",
              x: 390,
              y: 110,
              kind: "model",
              detail:
                "A single-task QLoRA adapter on DeepSeek-R1 14B. Chain-of-thought is cut at the stop token once a valid answer appears.",
              secs: 4.1,
            },
            {
              id: "cls",
              label: "Classify adapter",
              sub: "QLoRA · R1 14B",
              x: 560,
              y: 110,
              kind: "model",
              detail: "A second adapter on the same base model. Both are served by vLLM with PagedAttention on one smaller GPU.",
              secs: 6.5,
            },
            {
              id: "out",
              label: "Decision",
              x: 700,
              y: 110,
              kind: "io",
              detail: "p95 under 11 seconds, 98% accurate, nothing leaves our servers.",
              secs: 0,
            },
            {
              id: "fb",
              label: "Accept / reject",
              sub: "HANA",
              x: 560,
              y: 240,
              kind: "store",
              detail: "Every output and every human accept or reject is stored. That becomes preference data for free.",
            },
            {
              id: "orpo",
              label: "ORPO tuning",
              x: 390,
              y: 240,
              kind: "code",
              detail: "Continuous preference tuning with ORPO. DPO caused catastrophic forgetting, ORPO didn't.",
            },
          ],
          edges: [
            ["in", "pre"],
            ["pre", "ext"],
            ["ext", "cls"],
            ["cls", "out"],
            ["out", "fb", "dashed"],
            ["fb", "orpo", "dashed"],
            ["orpo", "ext", "dashed"],
          ],
          group: { label: "vLLM · one GPU", ids: ["ext", "cls"] },
        },
      },
    ],
    trace: {
      unit: "s",
      axis: 90,
      before: [
        { name: "gpt · hop 1", start: 0, dur: 31 },
        { name: "gpt · hop 2", start: 31, dur: 27 },
        { name: "gpt · hop 3", start: 58, dur: 32 },
      ],
      after: [
        { name: "preprocess", start: 0, dur: 0.4 },
        { name: "extract adapter", start: 0.4, dur: 4.1 },
        { name: "classify adapter", start: 4.5, dur: 6.5 },
      ],
      note: "p95 totals are real. The split between steps is illustrative.",
    },
    sections: [
      {
        id: "problem",
        title: "Three GPT calls, one slow answer.",
        body: [
          "Change records were classified by chaining three calls to an external GPT model. Each hop waited on the last, errors compounded, and p95 latency sat around 90 seconds.",
          "Worse, every call sent customer configuration data to a third party. For sovereignty-sensitive customers that was a hard blocker.",
        ],
      },
      {
        id: "built",
        kind: "pipeline",
        title: "Two small models that each do one job.",
        body: [
          "I split the work into single-task adapters on one open-weight base model, and moved normalization into deterministic code. Toggle between the old and new pipeline, click any step, or press Run to watch a request go through at relative speed.",
        ],
      },
      {
        id: "data",
        kind: "list",
        title: "The data was the unlock, not the model.",
        body: [
          "Distilling from a bigger teacher hit a ceiling below human accuracy. The teacher's labels were confidently wrong in ways the student copied.",
        ],
        items: [
          {
            title: "Benchmarked four bases",
            text: "DeepSeek-R1, Qwen 2.5, Gemma and Phi-2 on accuracy and inference footprint. R1 won on reasoning quality.",
          },
          { title: "A 4,000-row gold set", text: "Human-labeled examples replaced teacher labels and lifted held-out accuracy to 98%." },
          { title: "ORPO over DPO", text: "DPO caused catastrophic forgetting in post-launch tuning. ORPO, done in training, didn't." },
        ],
      },
      {
        id: "speed",
        kind: "trace",
        title: "Where the 79 seconds went.",
        body: ["Drag the playhead, or press Replay, to compare both pipelines at the same moment in time."],
      },
      {
        id: "serving",
        kind: "code",
        title: "Serving it on one smaller GPU.",
        body: [
          "vLLM with PagedAttention cut KV-cache waste by about 60% and tripled sustained throughput, so both adapters fit on one instance instead of scaling out. Hover the highlighted lines.",
        ],
        code: {
          file: "serve.py · simplified",
          lines: [
            { text: "from vllm import LLM, SamplingParams" },
            { text: "from vllm.lora.request import LoRARequest" },
            { text: "" },
            { text: 'llm = LLM(model="deepseek-r1-14b",', note: "One base model, loaded once." },
            { text: "          enable_lora=True, max_loras=2,", note: "Both task adapters share the base weights." },
            { text: "          gpu_memory_utilization=0.92)", note: "PagedAttention packs the KV cache, so this can run high." },
            { text: "" },
            { text: 'extract = LoRARequest("extract", 1, EXTRACT_PATH)' },
            { text: 'classify = LoRARequest("classify", 2, CLASSIFY_PATH)' },
            { text: "" },
            {
              text: "params = SamplingParams(max_tokens=budget(record),",
              note: "Dynamic token budget per record, with backoff re-inference.",
            },
            {
              text: '                        stop=["</answer>"])',
              note: "Stop at the answer tag instead of letting the reasoning run on.",
            },
          ],
        },
      },
      {
        id: "shipped",
        kind: "list",
        title: "Shipping it like software.",
        body: ["Models are only useful if you can roll them forward and back safely."],
        items: [
          { title: "GitOps deploys", text: "Docker, ArgoCD and KServe on SAP BTP, with S3 model versioning and database-backed lineage." },
          { title: "10+ model versions", text: "Reproducible rollouts, each traceable to its data and config." },
          { title: "A feedback loop", text: "Every tool call, output and human decision is stored, which feeds the next round of tuning." },
        ],
      },
      {
        id: "more",
        kind: "more",
        title: "More from SAP.",
        body: ["Other things I built here, in short."],
        items: [
          {
            title: "Agents over MCP, and a knowledge graph to ground them",
            stats: [
              { value: "5 min", from: "1.5 days", caption: "cross-system update" },
              { value: "−92%", caption: "developer query time" },
            ],
            text: [
              "FastMCP tool-calling agents now make a cross-system update that used to take a day and a half. Entity-level locking keeps concurrent writes safe, and 5-hop OAuth means every write traces back to a verified user.",
              "A knowledge-graph RAG service (RDF and SPARQL) answers questions for 5,000+ developers, served over MCP with PKCE auth and OpenTelemetry tracing.",
            ],
            stack: ["FastMCP", "RDF / SPARQL", "OAuth + PKCE", "OpenTelemetry"],
          },
          {
            title: "Teaching a model when to compact its own context",
            stats: [{ value: "12,300+", caption: "training examples" }],
            text: [
              "The SFT and RL data pipeline for a Qwen3 model. It joins OpenHands agent trajectories (PostgreSQL) with LLM spans (ClickHouse) into OpenAI-format examples.",
              "Kimi 2.7 labelled the data, including when the model should run /compact on its own context. Training ran on SageMaker, with endpoints wired straight into the CLI.",
            ],
            stack: ["Qwen3", "Kimi 2.7", "SageMaker", "PostgreSQL", "ClickHouse"],
          },
        ],
      },
    ],
  },
  {
    slug: "mihin",
    company: "MiHIN",
    logo: "mihin",
    role: "Software Engineer",
    timeline: "Mar 2025 – Jan 2026",
    place: "Binghamton, NY",
    scope: "Data pipelines, clinical RAG",
    title: ["Getting healthcare data ", "where it needs to go", "."],
    lede: "Records from more than ten healthcare organizations, multi-gigabyte files, and clinicians waiting hours for mappings. I made the pipeline faster and the retrieval actually find things.",
    stats: [
      { value: "500K+", caption: "records ingested" },
      { value: "40%", caption: "faster on multi-GB files" },
      { value: "10 min", from: "4 hr", caption: "note to EHR mapping" },
      { value: "88%", from: "61%", caption: "recall@20" },
    ],
    views: [
      {
        label: "Before",
        data: {
          nodes: [
            {
              id: "src",
              label: "10+ orgs",
              sub: "multi-GB files",
              x: 80,
              y: 150,
              kind: "io",
              detail: "Large files land from more than ten healthcare organizations.",
              secs: 0,
            },
            {
              id: "get",
              label: "Full-object read",
              sub: "S3",
              x: 270,
              y: 150,
              kind: "store",
              detail: "Each file was downloaded whole before any work started.",
              secs: 55,
            },
            {
              id: "parse",
              label: "Parse + load",
              sub: "one worker",
              x: 470,
              y: 150,
              kind: "code",
              detail: "A single worker parsed sequentially.",
              secs: 45,
            },
            { id: "db", label: "Records", x: 680, y: 150, kind: "io", detail: "Ready for downstream use, eventually.", secs: 0 },
          ],
          edges: [
            ["src", "get"],
            ["get", "parse"],
            ["parse", "db"],
          ],
        },
      },
      {
        label: "After",
        data: {
          nodes: [
            { id: "src", label: "10+ orgs", sub: "multi-GB files", x: 80, y: 150, kind: "io", detail: "Same inputs.", secs: 0 },
            { id: "ev", label: "EventBridge", x: 230, y: 150, kind: "code", detail: "New files trigger work immediately.", secs: 2 },
            {
              id: "r1",
              label: "20MB range",
              sub: "S3 Select",
              x: 400,
              y: 70,
              kind: "store",
              detail: "S3 Select with conditional ScanRange reads only the bytes each worker needs.",
              secs: 15,
            },
            {
              id: "r2",
              label: "20MB range",
              sub: "S3 Select",
              x: 400,
              y: 150,
              kind: "store",
              detail: "Chunks are processed in parallel through a ThreadPoolExecutor.",
              secs: 15,
            },
            {
              id: "r3",
              label: "20MB range",
              sub: "S3 Select",
              x: 400,
              y: 230,
              kind: "store",
              detail: "Containerized on ECS Fargate, provisioned with Terraform.",
              secs: 15,
            },
            {
              id: "db",
              label: "Records",
              sub: "DynamoDB",
              x: 640,
              y: 150,
              kind: "io",
              detail: "About 40% faster end to end on multi-GB files.",
              secs: 0,
            },
          ],
          edges: [
            ["src", "ev"],
            ["ev", "r1"],
            ["ev", "r2"],
            ["ev", "r3"],
            ["r1", "db"],
            ["r2", "db"],
            ["r3", "db"],
          ],
          group: { label: "ECS Fargate · parallel", ids: ["r1", "r2", "r3"] },
        },
      },
    ],
    trace: {
      unit: "%",
      axis: 100,
      before: [
        { name: "download whole file", start: 0, dur: 55 },
        { name: "parse sequentially", start: 55, dur: 45 },
      ],
      after: [
        { name: "trigger", start: 0, dur: 2 },
        { name: "ranged reads ×3", start: 2, dur: 30 },
        { name: "parse in parallel", start: 12, dur: 48 },
      ],
      note: "Shown as a share of the old run time. The 40% saving is real; the split is illustrative.",
    },
    sections: [
      {
        id: "problem",
        title: "Big files, one worker, long waits.",
        body: [
          "Multi-gigabyte files from more than ten organizations were downloaded whole and parsed by one worker. Clinicians waited hours for physician notes to be mapped into EHR fields by hand.",
        ],
      },
      {
        id: "built",
        kind: "pipeline",
        title: "Read only what you need, in parallel.",
        body: ["Toggle between the old and new pipeline, click any step, or press Run."],
      },
      {
        id: "speed",
        kind: "trace",
        title: "40% faster end to end.",
        body: ["Drag the playhead to compare both runs at the same moment."],
      },
      {
        id: "more",
        kind: "more",
        title: "More from MiHIN.",
        body: ["The other half of the job: helping clinicians find the right record."],
        items: [
          {
            title: "Clinical RAG on Vertex AI",
            stats: [
              { value: "10 min", from: "4 hr", caption: "note to EHR mapping" },
              { value: "88%", from: "61%", caption: "recall@20" },
            ],
            text: [
              "A Vertex AI RAG workflow maps physician notes to EHR fields, served through FastAPI and React. Most of the gain came from fixing retrieval, not the model.",
              "Embedding only the free text and filtering on the structured fields stopped diluting the vector. A graph-driven pre-filter removed about 87% of 48K records before similarity scoring, and FHIR and SPARQL lookups resolved entities instead of guessing.",
            ],
            stack: ["Vertex AI", "FHIR", "SPARQL", "FastAPI", "React"],
          },
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
