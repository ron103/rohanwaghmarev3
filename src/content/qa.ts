import type { QA } from "@/components/about/ask-rohan";

// Placeholder answers in Rohan's voice. Edit freely.
export const qas: QA[] = [
  {
    q: "What do you work on at SAP?",
    keywords: ["sap", "work on", "job", "current", "now"],
    a: "I build production GenAI on the platform side: fine-tuned models that replaced an external GPT pipeline, MCP agents that update two systems of record from a chat, and a knowledge-graph search that thousands of developers use every day.",
  },
  {
    q: "Why fine-tune instead of calling GPT?",
    keywords: ["fine", "tune", "gpt", "why", "qlora", "cost"],
    a: "Cost, speed, and where the data goes. Two small adapters beat a three-hop GPT chain: 10 times cheaper, p95 down from 90 seconds to 11, and nothing leaves our infrastructure. The real unlock was a 4,000-row human-labeled gold set, not the model.",
  },
  {
    q: "What's your favorite bug?",
    keywords: ["bug", "favorite", "favourite", "mistake"],
    a: "A preprocessing step was silently stripping tool calls from 99.6% of assistant turns before training. We'd have trained an agent that never uses tools. A boring test suite caught it, which is why I like boring test suites.",
  },
  {
    q: "Are you open to new roles?",
    keywords: ["hire", "hiring", "open", "role", "job", "opportunit"],
    a: "I'm always happy to talk about hard AI systems problems. Email me with what you're building and what's broken, and I'll reply.",
  },
  {
    q: "What do you do for fun?",
    keywords: ["fun", "hobby", "hobbies", "weekend", "free time"],
    a: "Side projects, mostly. Lately a prediction-market trading bot. Also long walks around the Bay, and too much chai.",
  },
];
