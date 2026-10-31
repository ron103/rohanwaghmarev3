// Mirrors Rohan's one-page LaTeX resume. Phone number intentionally left off the public site.

export const resume = {
  name: "Rohan Waghmare",
  headline: "Software Developer / AI Engineer",
  contact: ["Palo Alto, CA", "waghmarerohan30@gmail.com", "github.com/ron103", "linkedin.com/in/rohanwaghmare"],
  summary:
    "Software engineer shipping production GenAI systems end to end: LLM agents (LangGraph, MCP), RAG, and QLoRA fine-tuning, served through FastAPI services and Kubernetes CI/CD on AWS and GCP.",
  experience: [
    {
      org: "SAP Labs US",
      when: "Jan 2026 – Present",
      role: "Software Developer",
      where: "Palo Alto, CA",
      bullets: [
        ["LLM Fine-Tuning", "Cut inference cost 10× and p95 latency from 90s to under 11s at 98% accuracy by replacing a 3-hop GPT pipeline with two QLoRA adapters on DeepSeek-R1 14B, served through vLLM."],
        ["Agentic/MCP", "Shrank a cross-system update from 1.5 days to 5 minutes with FastMCP tool-calling agents, using entity-level locking for concurrent writes and 5-hop OAuth so every write traces to a verified user."],
        ["KG RAG", "Reduced developer query time 92% (1 hr to 5 min) for 5,000+ developers with a knowledge-graph RAG service (RDF/SPARQL) served over MCP with PKCE auth and OpenTelemetry."],
        ["Data Pipeline", "Built the SFT/RL data pipeline for a Qwen3 model, joining OpenHands trajectories (PostgreSQL) with LLM spans (ClickHouse) into 12,300+ OpenAI-format examples for SageMaker training."],
        ["MLOps", "Shipped 10+ model versions through a GitOps pipeline (Docker, ArgoCD, KServe) with a HANA accept/reject store feeding ORPO preference tuning."],
      ],
    },
    {
      org: "Michigan Health Information Network",
      when: "Mar 2025 – Jan 2026",
      role: "Software Engineer",
      where: "Binghamton, NY",
      bullets: [
        ["Data Ingestion", "Cut ingestion latency 40% on multi-GB files by reading S3 in parallel 20MB byte ranges in a Python pipeline on AWS (ECS, Terraform) handling 500K+ records from 10+ healthcare orgs."],
        ["Clinical RAG", "Cut physician-note-to-EHR mapping from 4 hours to 10 minutes with a Vertex AI RAG workflow using federated FHIR/SPARQL retrieval, served through FastAPI/React."],
        ["Retrieval Quality", "Raised search accuracy (recall@20) from 61% to 88% across 48K records by separating free text from structured filters and adding a pre-filter."],
      ],
    },
  ],
  projects: [
    {
      name: "Agentic Tool Orchestrator",
      stack: "FastAPI, OpenAI API, Python",
      text: "Raised instruction-following from 50% to 100% with an agent router across 191 tools in 7 services, cutting context 40%; hardened with circuit breakers and a 24-test end-to-end suite.",
    },
    {
      name: "Tuberculosis Detection via Transfer Learning",
      stack: "TensorFlow, ResNet-50, Python",
      text: "Reached 92% accuracy on TBX11K with ResNet-50, CLAHE preprocessing, and augmentation, validated via Grad-CAM, F1, and AUC; co-authored an IEEE paper synthesizing 60+ studies.",
    },
  ],
  education: [
    { school: "Binghamton University, State University of New York", when: "Aug 2023 – Dec 2025", degree: "Master of Science in Computer Science", where: "Binghamton, NY" },
    { school: "School of Engineering, MIT ADT", when: "Aug 2019 – May 2023", degree: "Bachelor of Technology in Computer Science", where: "Pune, India" },
  ],
  skills: [
    ["Languages", "Python, TypeScript / JavaScript, SQL, SPARQL"],
    ["LLM Engineering", "LLM fine-tuning (QLoRA / PEFT / TRL), ORPO / DPO, Hugging Face, PyTorch, vLLM"],
    ["Agent Systems & Evaluation", "RAG, MCP / LLM tool calling, LangGraph, Knowledge Graphs, RAGAS, LangSmith, Laminar, OpenHands, SWE-bench, SFT data generation"],
    ["Backend & Data", "FastAPI, Node.js, React, REST, PostgreSQL, HANA, Neo4j, Pinecone, MongoDB, Pandas, NumPy"],
    ["Cloud, Delivery & Observability", "GCP (Vertex AI, BigQuery, Cloud Run, Pub/Sub, Vector Search), Docker, Kubernetes, KServe, ArgoCD, Terraform, OpenTelemetry, Linux, Git"],
  ],
};
