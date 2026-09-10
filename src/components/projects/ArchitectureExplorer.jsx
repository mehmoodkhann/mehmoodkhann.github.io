import { Fragment, useId, useState } from "react";
import {
  FiFileText,
  FiScissors,
  FiDatabase,
  FiSearch,
  FiMessageSquare,
  FiCpu,
  FiLayers,
  FiArrowUpRight,
} from "react-icons/fi";
const phases = [
  {
    label: "Ingest",
    caption: "Make documents retrievable.",
    description:
      "Load a PDF, preprocess its text, split it into chunks, and index Hugging Face embeddings in Qdrant Cloud.",
    nodes: [
      ["PDF document", "PyMuPDF · load + preprocess", FiFileText],
      ["Text chunks", "Document processing + chunking", FiScissors],
      ["Hugging Face embeddings", "Vectors stored in Qdrant Cloud", FiDatabase],
    ],
  },
  {
    label: "Retrieve",
    caption: "Find context for a question.",
    description:
      "The retrieval layer uses a question to look up relevant document chunks in the vector store. That context becomes input to the RAG pipeline.",
    nodes: [
      ["User question", "React → FastAPI", FiMessageSquare],
      ["Semantic retrieval", "Hugging Face embeddings + Qdrant", FiSearch],
      ["Retrieved context", "Document chunks → RAG pipeline", FiLayers],
    ],
  },
  {
    label: "Generate",
    caption: "Answer with document context.",
    description:
      "The RAG pipeline brings the question, retrieved context, and prompt together. Google Gemini generates the response returned to the chat interface.",
    nodes: [
      ["Question + context", "RAG pipeline + prompts", FiLayers],
      ["Google Gemini", "Language generation", FiCpu],
      ["Answer in chat", "FastAPI → React", FiMessageSquare],
    ],
  },
];
export default function ArchitectureExplorer({ compact = false }) {
  const [phase, setPhase] = useState(0);
  const id = useId();
  const active = phases[phase];
  return (
    <section
      className="hero-stage"
      aria-label="Research Paper Assistant architecture explorer"
    >
      <div className="stage-title">
        <span className="font-mono text-xs text-muted">
          research_assistant / architecture
        </span>
        <FiArrowUpRight className="text-muted" size={15} />
      </div>
      <div
        className="architecture-steps"
        role="group"
        aria-label="Explore RAG stages"
      >
        {phases.map((p, i) => (
          <button
            key={p.label}
            aria-pressed={i === phase}
            aria-controls={id}
            onClick={() => setPhase(i)}
          >
            {String(i + 1).padStart(2, "0")} {p.label}
          </button>
        ))}
      </div>
      <div id={id} className="stage-grid p-5 sm:p-7" aria-live="polite">
        <p className="font-display text-lg mb-6">{active.caption}</p>
        <ol>
          {active.nodes.map(([title, detail, Icon], i) => (
            <Fragment key={title}>
              <li className={`architecture-node ${i === 2 ? "active" : ""}`}>
                <span className="node-icon">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted mt-1">{detail}</p>
                </div>
              </li>
              {i < 2 && <li aria-hidden="true" className="connector" />}
            </Fragment>
          ))}
        </ol>
      </div>
      <div className="border-t border-line px-6 py-5">
        <p className="text-xs font-mono text-signal mb-2">
          RAG / Retrieval-Augmented Generation
        </p>
        {!compact && (
          <p className="text-sm text-muted leading-relaxed min-h-[4.5em]">
            {active.description}
          </p>
        )}
      </div>
    </section>
  );
}
