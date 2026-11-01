// Notes. Drafts written from Rohan's own work; he will rewrite them in his voice.

export type Run = { text: string; mark?: boolean };
export type Block =
  | { kind: "p"; runs: Run[] }
  | { kind: "h"; text: string }
  | { kind: "figure"; figure: "embeddings" | "auth-chain" | "distill" | "compaction" | "seq-parallel" | "placeholder"; caption: string };

export type Note = {
  slug: string;
  title: string;
  dek: string;
  topic: string;
  date: string;
  quote: Run[];
  blocks: Block[];
};

const p = (...runs: (string | [string])[]): Block => ({
  kind: "p",
  runs: runs.map((r) => (typeof r === "string" ? { text: r } : { text: r[0], mark: true })),
});

export const notes: Note[] = [
  {
    slug: "embed-less",
    title: "Embed less, find more",
    dek: "Recall went from 61% to 88% by putting fewer fields into the vector, not more.",
    topic: "Retrieval",
    date: "Draft",
    quote: [{ text: "Concatenating fields into one vector " }, { text: "poisons the embedding.", mark: true }],
    blocks: [
      p(
        "We had 48,000 configuration records. Each one had a free-text description and seven structured fields: region, module, owner, and so on. The obvious move was to glue everything into one string and embed it.",
      ),
      p("That obvious move ", ["quietly broke retrieval"], ". Recall@20 sat at 61%, and no amount of prompt tuning on the generation side fixed it."),
      { kind: "h", text: "Why concatenation hurts" },
      p(
        "An embedding is an average of meaning. When half the tokens are field names and enum values, records that share a region look closer than records that share a purpose. The vector stops being about what the record ",
        ["means"],
        " and starts being about how it's ",
        ["filed"],
        ".",
      ),
      {
        kind: "figure",
        figure: "embeddings",
        caption: "Drag the query point. Colors are the true topic of each record; a hit is a neighbor with the same topic.",
      },
      { kind: "h", text: "The fix" },
      p(
        "Embed only the free text. Keep the seven structured fields as metadata and ",
        ["filter on them before"],
        " similarity search. A graph-driven pre-filter pruned about 87% of the space before scoring, then a reranker sorted what was left.",
      ),
      p("Recall@20 went from 61% to 88%. Top-3 precision went from 71% to 89%. Same model, same data, ", ["fewer tokens in the vector"], "."),
    ],
  },
  {
    slug: "gold-labels",
    title: "The teacher was confidently wrong",
    dek: "Distillation copies a big model's mistakes with perfect confidence. 4,000 human labels fixed it.",
    topic: "Fine-tuning",
    date: "Draft",
    quote: [{ text: "The teacher model was confidently wrong. " }, { text: "4,000 human labels fixed it.", mark: true }],
    blocks: [
      p(
        "We fine-tuned small adapters by distilling from a larger teacher model. It worked until it didn't: held-out accuracy plateaued ",
        ["below the human baseline"],
        ", and more teacher data made it worse.",
      ),
      p("The student was learning the teacher's hallucinations. Distillation has no way to tell a confident right answer from a ", ["confident wrong one"], "."),
      {
        kind: "figure",
        figure: "distill",
        caption: "Toggle the label source. The curve shapes and the human baseline are illustrative; 98% is the real result.",
      },
      p("We stopped scaling teacher labels and wrote a ", ["4,000-row human-labeled gold set"], " instead. Held-out accuracy went to 98%."),
      p("Then post-launch tuning: DPO caused catastrophic forgetting, ORPO in training didn't. The data and the loss mattered more than the model."),
    ],
  },
  {
    slug: "agents-in-prod",
    title: "Every agent write needs a name on it",
    dek: "An agent you can't audit is a demo, not a product.",
    topic: "Agents",
    date: "Draft",
    quote: [{ text: "Every agent write " }, { text: "needs a human's name on it.", mark: true }],
    blocks: [
      p(
        "We built MCP agents that let non-engineers push a 200-artifact change across two systems of record in two tool calls. The hard part wasn't the model. It was ",
        ["making every write attributable"],
        ".",
      ),
      p("A five-hop OAuth chain carries the end user's identity all the way to the system of record, so no write is ever just \"the agent\"."),
      { kind: "h", text: "The chain" },
      p(
        "User → Claude → MCP server → PKCE with XSUAA → SAP auth → Microsoft Entra. Each hop exists for one reason: to make sure the next one ",
        ["can't act without the user"],
        ".",
      ),
      { kind: "figure", figure: "auth-chain", caption: "Click a hop, or press Next hop, to follow one request from chat to the identity provider." },
      p(
        "Claude never sees a password and holds no long-lived credential. The MCP server has ",
        ["no shared service account"],
        " to fall back on, so a call without a valid user token simply fails. PKCE lets a public client get tokens from XSUAA without storing a secret, and an intercepted code is useless on its own.",
      ),
      p(
        "SAP checks the token and the user's roles before any write, and Microsoft Entra sits at the root: it's what says the person behind the token is a real, active employee. When something changes, the log says ",
        ["exactly who asked for it"],
        ".",
      ),
      { kind: "h", text: "Locks and logs" },
      p("Entity-level locks serialize conflicting writes across ten workers, and every tool call is logged with ", ["who, what and when"], ", so any change can be rolled back."),
    ],
  },
  {
    slug: "too-long-to-train",
    title: "Too long to train on",
    dek: "Agent runs were 50K–100K+ tokens. Two levers got them under budget: compaction and sequence parallelism.",
    topic: "Training",
    date: "Draft",
    quote: [{ text: "The runs didn't fit the window. " }, { text: "So we changed both.", mark: true }],
    blocks: [
      p(
        "We were fine-tuning Gemma-4-12B on real software-engineering agent runs. The runs were 50K–100K+ tokens long, and the proof of concept trained at 16K. The question for the whole project was simple: ",
        ["how do we fit them under our budget?"],
      ),
      p("There are two levers. You can make the run smaller, or make the window bigger. We pulled both."),
      { kind: "h", text: "Lever one: compaction" },
      p(
        "Cut the run into windows, and when the history no longer fits, have a teacher model summarize what came before. The next sample starts from that summary. One rule mattered more than any other: ",
        ["never split a tool call from its result"],
        ". A call without its output teaches the model nothing.",
      ),
      { kind: "figure", figure: "compaction", caption: "Pick a window size. Smaller windows mean more samples and more compactions to learn from." },
      p(
        "From 279 trajectories that gave 1,908 samples at 16K, 660 at 32K and 361 at 64K, with no sample over its limit. The catch: Kimi, the summarizer, didn't reliably respect the requested length. A five-attempt loop that shrinks the budget by how far it overshot ",
        ["took summary failures to zero"],
        ".",
      ),
      { kind: "h", text: "Lever two: sequence parallelism" },
      p(
        "Compaction throws detail away. For the longest samples we wanted the model to see more of the run as it actually happened. Sequence parallelism splits one sample across GPUs, and they exchange what attention needs, so every token still sees the whole context.",
      ),
      { kind: "figure", figure: "seq-parallel", caption: "One 63K-token sample on one GPU versus split eight ways." },
      p(
        "We trained on ml.p6-b200.48xlarge: eight B200s, sequence parallelism 8, data parallelism 1. The longest sample was ",
        ["63,263 tokens"],
        ", up from the 16K proof of concept.",
      ),
      { kind: "h", text: "Which one, when" },
      p(
        "They aren't rivals. Compaction teaches the model to work from summaries, which is what an agent with a condenser does at inference anyway. Sequence parallelism keeps raw context but costs hardware: with data parallelism at 1, all eight GPUs work on one sample at a time. Compaction sets the window, ",
        ["sequence parallelism makes the window big"],
        ".",
      ),
    ],
  },
];

export function getNote(slug: string) {
  return notes.find((n) => n.slug === slug);
}

/** Rough token count (≈4 characters per token) for the reading bar. */
export function tokenCount(n: Note) {
  const chars = n.blocks.reduce((s, b) => s + (b.kind === "p" ? b.runs.reduce((t, r) => t + r.text.length, 0) : b.kind === "h" ? b.text.length : b.caption.length), 0);
  return Math.round((chars + n.title.length + n.dek.length) / 4);
}
