import { caseStudies, type CaseStudy } from "./work";

// Second and third stories from a role, shown at /work/[company]/[story].
// Real numbers come from Rohan's write-ups; per-step splits, sample records
// and graph contents are illustrative and labelled on the page.

export type Story = CaseStudy & { parent: string; storyLabel: string };

export const stories: Story[] = [
  {
    parent: "sap",
    slug: "agents",
    storyLabel: "Agents & knowledge graph",
    company: "SAP",
    logo: "sap",
    badge: "Agents · 2026",
    role: "Software Developer",
    team: "Research & Innovation",
    timeline: "2026",
    place: "Palo Alto, CA",
    scope: "MCP agents, knowledge-graph RAG",
    title: ["Letting agents write to ", "systems that matter", "."],
    lede: "Keeping a change in sync between SAP and Perforce took a day and a half of hand-offs. MCP tool-calling agents now do it in five minutes, with locks so they can't overwrite each other and an auth chain that puts a person's name on every write.",
    stats: [
      { value: "5 min", from: "1.5 days", caption: "cross-system update" },
      { value: "−92%", caption: "developer query time" },
      { value: "5,000+", caption: "developers served" },
      { value: "5", caption: "OAuth hops to a real user" },
    ],
    views: [
      {
        label: "Before",
        data: {
          timed: false,
          nodes: [
            { id: "req", label: "Change request", x: 70, y: 150, kind: "io", detail: "A change that has to land in both SAP and Perforce.", secs: 1 },
            { id: "a", label: "Engineer", sub: "SAP side", x: 230, y: 150, kind: "code", detail: "Someone updates the SAP side by hand.", secs: 5 },
            {
              id: "wait",
              label: "Hand-off",
              sub: "ticket + queue",
              x: 390,
              y: 150,
              kind: "io",
              detail: "Then a ticket, and a wait for someone who owns the Perforce side. Most of the day and a half was here.",
              secs: 12,
            },
            { id: "b", label: "Engineer", sub: "Perforce side", x: 550, y: 150, kind: "code", detail: "A second person makes the matching Perforce change.", secs: 5 },
            { id: "done", label: "In sync", x: 700, y: 150, kind: "io", detail: "About 1.5 days later, both systems agree.", secs: 0 },
          ],
          edges: [
            ["req", "a"],
            ["a", "wait"],
            ["wait", "b"],
            ["b", "done"],
          ],
        },
      },
      {
        label: "After",
        data: {
          timed: false,
          nodes: [
            { id: "req", label: "Change request", x: 70, y: 150, kind: "io", detail: "Same request.", secs: 1 },
            {
              id: "agent",
              label: "Agent",
              sub: "FastMCP tools",
              x: 230,
              y: 150,
              kind: "llm",
              detail: "A tool-calling agent plans the change and calls SAP and Perforce tools exposed over MCP.",
              secs: 4,
            },
            {
              id: "lock",
              label: "Entity lock",
              sub: "per record",
              x: 390,
              y: 150,
              kind: "code",
              detail: "Before writing, the agent locks the specific record. Other agents can keep working on other records in parallel.",
              secs: 1,
            },
            { id: "sap", label: "SAP", x: 560, y: 90, kind: "store", detail: "The SAP side of the change.", secs: 2 },
            { id: "p4", label: "Perforce", x: 560, y: 210, kind: "store", detail: "The matching Perforce change.", secs: 2 },
            { id: "audit", label: "Audit trail", sub: "who wrote what", x: 700, y: 150, kind: "store", detail: "Every write is recorded against the verified user who asked for it.", secs: 0 },
            {
              id: "auth",
              label: "OAuth chain",
              sub: "5 hops",
              x: 230,
              y: 262,
              kind: "code",
              detail: "User → Claude → MCP server → PKCE with XSUAA → SAP auth → Microsoft Entra. The user's identity survives every hop, so no write is anonymous.",
            },
          ],
          edges: [
            ["req", "agent"],
            ["agent", "lock"],
            ["lock", "sap"],
            ["lock", "p4"],
            ["sap", "audit"],
            ["p4", "audit"],
            ["auth", "agent", "dashed"],
          ],
        },
      },
    ],
    sections: [
      {
        id: "problem",
        title: "A day and a half of hand-offs.",
        body: [
          "Some changes have to land in both SAP and Perforce. That meant two people, two tools and a queue in between. The edits themselves were quick. The waiting wasn't.",
        ],
      },
      {
        id: "built",
        kind: "pipeline",
        title: "One agent does both halves.",
        body: ["The agent calls SAP and Perforce tools over MCP, locks the record it's changing, and logs every write against a real user. Press Run, or click any step."],
      },
      {
        id: "locks",
        kind: "locks",
        title: "Two agents, one record.",
        body: [
          "Agents run at the same time. If two of them read the same record and both write it back, the second write silently erases the first.",
          "Entity-level locks make the second agent wait for that one record only, so unrelated work still runs in parallel. Toggle the lock and press Play.",
        ],
      },
      {
        id: "kg",
        kind: "kg",
        title: "A graph that answers developer questions.",
        body: [
          "Answers about services, APIs, owners and code were spread across docs and systems. A knowledge-graph RAG service (RDF and SPARQL), served over MCP, cut the time to an answer from an hour to five minutes for 5,000+ developers.",
          "Pick a question to see the path it takes through the graph.",
        ],
      },
      {
        id: "trust",
        kind: "list",
        title: "Every write has a name on it.",
        body: ["Agents that change real systems need to be accountable and observable."],
        items: [
          {
            title: "5-hop OAuth",
            text: "User → Claude → MCP server → PKCE with XSUAA → SAP auth → Microsoft Entra. The user's identity travels the whole way, so every write traces to a verified person.",
          },
          { title: "PKCE", text: "The knowledge-graph service uses OAuth with PKCE, so a public client can sign in safely." },
          { title: "OpenTelemetry", text: "Every query and tool call is traced, so slow or failing paths show up on a dashboard." },
        ],
      },
    ],
  },
  {
    parent: "sap",
    slug: "training-data",
    storyLabel: "Long-context training data",
    company: "SAP",
    logo: "sap",
    badge: "SFT · 2026",
    role: "Software Developer",
    team: "Research & Innovation",
    timeline: "2026",
    place: "Palo Alto, CA",
    scope: "SFT data, SageMaker, evaluation",
    title: ["Training on agent runs ", "too long to fit", "."],
    lede: "SAP wanted Gemma-4-12B fine-tuned on real software-engineering agent runs, and the runs were 50K–100K+ tokens. The whole project was one question: how do we fit them under our budget? Compaction was one answer, sequence parallelism the other. The fine-tuned model's agent pass rate went from 65% to 80.8%.",
    stats: [
      { value: "80.8%", from: "65%", caption: "agent pass rate" },
      { value: "63K", from: "16K", caption: "longest sample trained" },
      { value: "279", caption: "trajectories converted" },
      { value: "8× B200", caption: "sequence-parallel" },
    ],
    views: [
      {
        label: "Training data",
        data: {
          timed: false,
          nodes: [
            { id: "raw", label: "Agent traces", sub: "Laminar · OpenHands", x: 70, y: 90, kind: "io", detail: "Raw CAP software-engineering runs, 50K–100K+ tokens each, mixed with unrelated LLM spans.", secs: 1 },
            {
              id: "conv",
              label: "Converter",
              sub: "Gemma-aware",
              x: 230,
              y: 90,
              kind: "code",
              detail: "Rebuilds each conversation, keeps tool calls and reasoning, and treats an assistant call plus its tool result as one unit that is never split.",
              secs: 4,
            },
            {
              id: "split",
              label: "Split",
              sub: "by task",
              x: 390,
              y: 90,
              kind: "code",
              detail: "Deterministic task-level split, so no task appears in both train and eval. Also filters runs and compresses oversized tool outputs.",
              secs: 1,
            },
            {
              id: "kimi",
              label: "Kimi",
              sub: "summary teacher",
              x: 550,
              y: 90,
              kind: "llm",
              detail: "When history no longer fits, Kimi summarizes it. Summaries are cached, and a five-attempt loop shrinks any that come back too long.",
              secs: 6,
            },
            {
              id: "data",
              label: "Datasets",
              sub: "16K · 32K · 64K",
              x: 550,
              y: 225,
              kind: "store",
              detail: "Three bounded datasets with provenance manifests and failure reports. Not one sample over its context limit.",
              secs: 1,
            },
            {
              id: "train",
              label: "SageMaker SFT",
              sub: "Gemma-4-12B",
              x: 390,
              y: 225,
              kind: "model",
              detail:
                "On ml.p6-b200.48xlarge: 8× B200 with sequence parallelism 8 and data parallelism 1, up to 63,263 tokens per sample. The notebook was fixed so preprocessing keeps tool calls, IDs, names and reasoning.",
              secs: 8,
            },
            { id: "cortex", label: "Cortex", sub: "dataset registry", x: 700, y: 225, kind: "store", detail: "Datasets are registered so they can be mixed with the base SFT corpus.", secs: 0 },
          ],
          edges: [
            ["raw", "conv"],
            ["conv", "split"],
            ["split", "kimi"],
            ["kimi", "data"],
            ["data", "train"],
            ["data", "cortex", "dashed"],
          ],
        },
      },
      {
        label: "Evaluation",
        data: {
          timed: false,
          nodes: [
            { id: "task", label: "CAP-Bench task", x: 70, y: 150, kind: "io", detail: "A real CAP software-engineering task.", secs: 1 },
            { id: "oh", label: "OpenHands", sub: "agent", x: 230, y: 150, kind: "llm", detail: "The benchmark's agent, now able to run on a SageMaker-hosted model.", secs: 4 },
            {
              id: "llm",
              label: "LiteLLM",
              sub: "sagemaker_chat",
              x: 390,
              y: 150,
              kind: "code",
              detail: "An environment-driven LiteLLM config routes OpenHands to SageMaker, including inference-component headers.",
              secs: 1,
            },
            { id: "sm", label: "SageMaker", sub: "inference component", x: 550, y: 150, kind: "model", detail: "The fine-tuned Gemma endpoint. The transport was validated against a live endpoint.", secs: 5 },
            { id: "score", label: "Score", x: 700, y: 150, kind: "io", detail: "Agent pass rate went from 65% to 80.8%, counting both fail-to-pass and pass-to-pass tests.", secs: 0 },
            {
              id: "batch",
              label: "AWS Batch",
              sub: "secrets",
              x: 390,
              y: 262,
              kind: "code",
              detail: "Credentials propagate into AWS Batch jobs, so evaluation runs at scale.",
            },
          ],
          edges: [
            ["task", "oh"],
            ["oh", "llm"],
            ["llm", "sm"],
            ["sm", "score"],
            ["batch", "llm", "dashed"],
          ],
        },
      },
    ],
    sections: [
      {
        id: "problem",
        kind: "list",
        title: "Runs too long, too noisy, too lossy.",
        body: [
          "The source traces had three problems before any training could start. Length was the big one: the question for the whole project was how to fit runs this long under our context and memory budget.",
        ],
        items: [
          { title: "Too long", text: "Runs were 50K–100K+ tokens, far past what a 16K proof of concept could hold." },
          { title: "Too noisy", text: "Traces mixed in LLM spans that had nothing to do with the agent's work." },
          { title: "Too lossy", text: "Notebook preprocessing was silently dropping tool calls, IDs, names and reasoning." },
        ],
      },
      {
        id: "built",
        kind: "pipeline",
        title: "From raw traces to a benchmark score.",
        body: ["Two halves: building the data, and evaluating the trained model as an agent. Switch between them, or click any step."],
      },
      {
        id: "context",
        kind: "context",
        title: "Lever one: cut the run, keep the meaning.",
        body: [
          "A tool call and its result are one unit, so a cut never lands between them. When the history won't fit, Kimi summarizes what came before, and the next sample starts from that summary.",
          "Pick a window size. Smaller windows mean more samples, and more compactions to learn from.",
        ],
      },
      {
        id: "sp",
        kind: "sp",
        title: "Lever two: split the sequence across GPUs.",
        body: [
          "Compaction shrinks what the model sees. Sequence parallelism handles what's left: one long sample is split across eight B200s, so a 63K-token sample trains where one GPU would run out of memory.",
          "That took us from a 16K proof of concept to samples up to 63,263 tokens. Toggle to compare.",
        ],
      },
      {
        id: "recompress",
        kind: "code",
        title: "When the summarizer ignores the limit.",
        body: ["Kimi didn't reliably respect the requested output length. Instead of dropping those samples, the converter retries with a tighter budget. Final summary-length failures: zero."],
        code: {
          file: "compact.py · simplified",
          lines: [
            { text: "def summarize(history, budget):" },
            { text: "    if (hit := cache.get(key(history, budget))):", note: "Summaries are cached, so an interrupted run reused 379 finished calls." },
            { text: "        return hit" },
            { text: "    target = budget" },
            { text: "    for attempt in range(5):", note: "Up to five attempts." },
            { text: "        summary = kimi(history, max_tokens=target)" },
            { text: "        n = count_tokens(summary)" },
            { text: "        if n <= budget:" },
            { text: "            return cache.put(key(history, budget), summary)" },
            { text: "        target = int(target * budget / n * 0.9)", note: "Shrink by how far over it went, plus a margin." },
            { text: "    raise SummaryTooLong(n, budget)", note: "Reported, never silently accepted." },
          ],
        },
      },
      {
        id: "fair",
        kind: "list",
        title: "Keeping the comparison honest.",
        body: [
          "Training runs are expensive, so the risks had to be caught before them. I also partnered on a second approach that trains a condenser (history to summary) separately from the agent (summary to next action), to compare against the summary-in-context data.",
        ],
        items: [
          { title: "No leakage", text: "Task-level, deterministic splits. The 64K set split exactly 326 train to 35 eval." },
          { title: "Nothing dropped", text: "All 13,958 agent actions and 15,375 tool calls in the 64K set survived preprocessing." },
          { title: "Caught early", text: "Cohort-dependent splits, a missing fuser transform and a notebook config mismatch, found before training." },
        ],
      },
    ],
  },
  {
    parent: "mihin",
    slug: "clinical-rag",
    storyLabel: "Clinical RAG",
    company: "MiHIN",
    logo: "mihin",
    badge: "RAG · 2025",
    role: "Software Engineer",
    timeline: "2025",
    place: "Binghamton, NY",
    scope: "Vertex AI RAG, FHIR, SPARQL",
    title: ["Mapping physician notes in ", "minutes, not hours", "."],
    lede: "Clinicians spent about four hours mapping a physician's note into EHR fields. A Vertex AI RAG workflow does it in ten minutes, and most of the win came from fixing retrieval, not the model.",
    stats: [
      { value: "10 min", from: "4 hr", caption: "note to EHR mapping" },
      { value: "88%", from: "61%", caption: "recall@20" },
      { value: "−87%", caption: "records before search" },
      { value: "48K", caption: "records searched" },
    ],
    views: [
      {
        label: "Before",
        data: {
          timed: false,
          nodes: [
            { id: "note", label: "Physician note", x: 70, y: 150, kind: "io", detail: "Free text from a clinician.", secs: 1 },
            { id: "read", label: "Clinician", sub: "reads + looks up", x: 260, y: 150, kind: "code", detail: "Someone reads the note and searches for each matching field by hand.", secs: 14 },
            { id: "ehr", label: "EHR search", sub: "48K records", x: 460, y: 150, kind: "store", detail: "Keyword search across 48K records, over and over.", secs: 8 },
            { id: "out", label: "Mapped fields", x: 680, y: 150, kind: "io", detail: "About four hours later.", secs: 0 },
          ],
          edges: [
            ["note", "read"],
            ["read", "ehr"],
            ["ehr", "out"],
          ],
        },
      },
      {
        label: "After",
        data: {
          timed: false,
          nodes: [
            { id: "note", label: "Physician note", x: 70, y: 150, kind: "io", detail: "Same note.", secs: 1 },
            {
              id: "resolve",
              label: "Resolve entities",
              sub: "FHIR · SPARQL",
              x: 225,
              y: 150,
              kind: "code",
              detail: "Federated FHIR and SPARQL lookups pin down patients, codes and drugs deterministically, instead of asking a model to guess.",
              secs: 2,
            },
            {
              id: "pre",
              label: "Graph pre-filter",
              sub: "−87% of records",
              x: 380,
              y: 150,
              kind: "code",
              detail: "The resolved entities prune about 87% of the 48K records before any similarity scoring.",
              secs: 1,
            },
            {
              id: "search",
              label: "Vector search",
              sub: "Vertex AI",
              x: 535,
              y: 150,
              kind: "model",
              detail: "Only the free text is embedded. Structured fields are filters, not part of the vector.",
              secs: 3,
            },
            { id: "out", label: "Mapped fields", x: 690, y: 150, kind: "io", detail: "About ten minutes, end to end.", secs: 0 },
            {
              id: "review",
              label: "Clinician review",
              sub: "FastAPI · React",
              x: 535,
              y: 262,
              kind: "io",
              detail: "A clinician confirms or fixes the suggested mapping in a small web app.",
            },
          ],
          edges: [
            ["note", "resolve"],
            ["resolve", "pre"],
            ["pre", "search"],
            ["search", "out"],
            ["out", "review", "dashed"],
          ],
        },
      },
    ],
    trace: {
      unit: "min",
      axis: 240,
      before: [
        { name: "read the note", start: 0, dur: 40 },
        { name: "search the EHR", start: 40, dur: 160 },
        { name: "fill fields", start: 200, dur: 40 },
      ],
      after: [
        { name: "resolve entities", start: 0, dur: 1.5 },
        { name: "pre-filter + search", start: 1.5, dur: 1.5 },
        { name: "clinician review", start: 3, dur: 7 },
      ],
      note: "Totals are real (about 4 hours to about 10 minutes). The split between steps is illustrative.",
    },
    sections: [
      {
        id: "problem",
        title: "Four hours per note.",
        body: [
          "Turning a physician's free-text note into structured EHR fields was manual: read, search, fill, repeat. A first RAG attempt helped less than expected, because retrieval kept surfacing the wrong records.",
        ],
      },
      {
        id: "built",
        kind: "pipeline",
        title: "Resolve, prune, then search.",
        body: ["Toggle between the old and new workflow, or click any step."],
      },
      {
        id: "retrieval",
        kind: "retrieval",
        title: "Embed less, find more.",
        body: [
          "The first version embedded all eight fields of each record into one vector. The structured fields drowned out the clinical text, so similar-looking but wrong records ranked first.",
          "Embedding only the free text, and using the rest as filters, lifted recall@20 from 61% to 88%. Toggle between the two and watch where the right record lands.",
        ],
      },
      {
        id: "speed",
        kind: "trace",
        title: "Where the four hours went.",
        body: ["Drag the playhead to compare both at the same moment."],
      },
    ],
  },
];

export const storiesOf = (parent: string) => stories.filter((s) => s.parent === parent);
export const getStory = (parent: string, slug: string) => stories.find((s) => s.parent === parent && s.slug === slug);

/** Every Work page in reading order: each company's main story, then its others. */
export const workPages = caseStudies.flatMap((c) => [
  { href: `/work/${c.slug}`, c },
  ...storiesOf(c.slug).map((s) => ({ href: `/work/${c.slug}/${s.slug}`, c: s as CaseStudy })),
]);

/** Side-nav items for Work: companies, with their stories when they have more than one. */
export const workNav = caseStudies.map((c) => {
  const more = storiesOf(c.slug);
  return {
    slug: c.slug,
    company: c.company,
    role: c.role,
    logo: c.logo,
    href: `/work/${c.slug}`,
    stories: more.length
      ? [{ href: `/work/${c.slug}`, label: c.storyLabel ?? "Overview" }, ...more.map((s) => ({ href: `/work/${c.slug}/${s.slug}`, label: s.storyLabel }))]
      : undefined,
  };
});
