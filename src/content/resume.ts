// Mirrors Rohan's one-page LaTeX resume (resume-v2). Phone number intentionally left off the public site.

export const resume = {
  name: "Rohan Waghmare",
  headline: "Software Engineer",
  contact: ["Palo Alto, CA", "waghmarerohan30@gmail.com", "linkedin.com/in/rohanwaghmare", "github.com/ron103", "rohanwaghmare.com"],
  summary:
    "Software engineer shipping production GenAI systems end to end: LLM agents (LangGraph, MCP), RAG, and QLoRA fine-tuning, served through FastAPI services and Kubernetes CI/CD on AWS and GCP. Open to relocation, available immediately.",
  experience: [
    {
      org: "SAP",
      when: "Jan 2026 – Present",
      role: "Software Developer, Research & Innovation",
      where: "Palo Alto, CA",
      bullets: [
        ["LLM Fine-Tuning", "Replaced a 3-hop external GPT pipeline with two QLoRA adapters on DeepSeek-R1 14B served via vLLM, cutting p95 latency from 90s to under 11s and inference cost 10× at 98% accuracy, with no customer data leaving SAP."],
        ["Training Data", "Lifted accuracy past the teacher model's ceiling by replacing distilled labels with a 4,000-row human gold set; shipped 10+ model versions via GitOps (Docker, ArgoCD, KServe) with ORPO preference tuning on HANA user feedback."],
        ["Agentic/MCP", "Cut a cross-system update from 1.5 days to 5 minutes with FastMCP tool-calling agents, using entity-level locking and a 5-hop OAuth chain (XSUAA with PKCE, Microsoft Entra) so every write traces to a verified user."],
        ["KG RAG", "Cut developer query time 92% (1 hr to 5 min) for 5,000+ developers with a knowledge-graph RAG service (RDF, SPARQL) served over MCP with OpenTelemetry tracing."],
        ["Long-Context SFT", "Raised Gemma-4's agent pass rate from 65% to 80.8% (fail-to-pass, pass-to-pass) by turning OpenHands traces into 16K/32K/64K SFT datasets, trained at 64K context with sequence parallelism on 8× B200 (SageMaker)."],
      ],
    },
    {
      org: "Michigan Health Information Network (MiHIN)",
      when: "Mar 2025 – Jan 2026",
      role: "Software Engineer",
      where: "Binghamton, NY",
      bullets: [
        ["Data Ingestion", "Cut ingestion latency 40% on multi-GB files by reading S3 in parallel 20MB byte ranges on AWS ECS (Terraform), processing 500K+ records from 10+ healthcare organizations."],
        ["Clinical RAG", "Cut physician-note-to-EHR mapping from 4 hrs to 10 min with a Vertex AI RAG workflow (FHIR/SPARQL entity resolution), raising recall@20 from 61% to 88% on 48K records via free-text-only embeddings and a graph pre-filter."],
      ],
    },
  ],
  projects: [
    {
      name: "Agentic Tool Orchestrator",
      stack: "Python, FastAPI, OpenAI API",
      text: "Built a two-stage agent (service router, then tool-calling loop) over 191 tools in 7 services, cutting per-call schema tokens 46% (37K to 20K), with fail-open routing, repeated-failure halts, and 80 tests incl. 8 live end-to-end scenarios.",
    },
    {
      name: "Industry Layoff Tracker",
      stack: "Python, Faktory, MongoDB, Flask",
      text: "Scored 200K+ posts a month for toxicity and sentiment with a self-healing crawler pipeline: hourly monitoring, day-by-day backfill, and API-key rotation under rate limits.",
    },
    {
      name: "Tuberculosis Detection via Transfer Learning",
      stack: "TensorFlow, ResNet-50, Python",
      text: "Trained ResNet-50 on TBX11K with CLAHE preprocessing and augmentation, achieving 92% accuracy; validated via Grad-CAM, F1, and AUC. Co-authored an IEEE-published paper synthesizing 60+ studies into a medical AI pipeline.",
    },
  ],
  education: [
    { school: "Binghamton University, State University of New York", when: "Aug 2023 – Dec 2025", degree: "Master of Science in Computer Science", where: "Binghamton, NY" },
    { school: "School of Engineering, MIT ADT University", when: "Aug 2019 – May 2023", degree: "Bachelor of Technology in Computer Science", where: "Pune, India" },
  ],
  skills: [
    ["LLM Engineering:", "QLoRA/PEFT, SFT, ORPO/DPO, vLLM, PyTorch, Hugging Face, RAG, MCP, LangGraph, Knowledge Graphs"],
    ["Languages & Frameworks:", "Python, TypeScript, SQL, Swift, C, FastAPI, React"],
    ["Cloud & Infra:", "AWS (SageMaker, ECS, S3), GCP (Vertex AI), Docker, Kubernetes, KServe, ArgoCD, Terraform, OpenTelemetry"],
    ["Databases:", "PostgreSQL, ClickHouse, MongoDB, Neo4j, SAP HANA"],
  ],
};
