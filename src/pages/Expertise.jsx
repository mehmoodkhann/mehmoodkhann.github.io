import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "../components/common/Container";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useCollection } from "../hooks/useCollection";
import { skillsService } from "../services/skillsService";
import { setPageMeta } from "../utils/seo";
export default function Expertise() {
  const { data: skills, loading, error } = useCollection(skillsService);
  const groups = skills.reduce((out, s) => {
    (out[s.category] ||= []).push(s);
    return out;
  }, {});
  useEffect(() => {
    setPageMeta({
      title: "Technical Skills | Mehmood Khan",
      description:
        "Applied skills in RAG, NLP, Python, FastAPI, LangChain, Hugging Face embeddings, Qdrant, React, and an ongoing focus on LangGraph.",
    });
  }, []);
  return (
    <Container className="pb-20">
      <header className="page-header">
        <p className="eyebrow mb-5">Skills / The engineering toolkit</p>
        <h1 className="page-title">
          Understand each layer.
          <br />
          <span className="text-accent">Connect the whole system.</span>
        </h1>
        <p className="intro">
          My strongest applied work is in document-based RAG applications.
          Agentic workflows are an active learning area.
        </p>
      </header>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {Object.entries(groups).map(([category, items]) => (
            <section key={category} className="border-t border-line pt-7">
              <h2 className="font-display text-2xl mb-5">{category}</h2>
              <ul>
                {items.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-line/60"
                  >
                    <span>{s.name}</span>
                    <span
                      className={`text-sm ${/Learning|Exploring/.test(s.level) ? "text-signal" : "text-muted"}`}
                    >
                      {s.level}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <div className="mt-16 p-7 bg-surfacealt rounded-md flex flex-col sm:flex-row gap-5 justify-between items-start">
        <p className="text-muted max-w-lg leading-relaxed">
          See how these technologies come together in the Research Paper
          Assistant.
        </p>
        <Link
          to="/projects/research-paper-assistant"
          className="text-link shrink-0"
        >
          Explore the architecture <FiArrowUpRight />
        </Link>
      </div>
    </Container>
  );
}
