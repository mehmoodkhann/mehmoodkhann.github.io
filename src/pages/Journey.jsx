import { useEffect } from "react";
import Container from "../components/common/Container";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useCollection } from "../hooks/useCollection";
import { journeyService, educationService } from "../services/contentService";
import { setPageMeta } from "../utils/seo";
export default function Journey() {
  const { data, loading, error } = useCollection(journeyService);
  const { data: education } = useCollection(educationService);
  useEffect(() => {
    setPageMeta({
      title: "AI Engineering Journey | Mehmood Khan",
      description:
        "An emerging AI engineer’s learning path through programming, Python, NLP, RAG, vector databases, and agentic workflows.",
    });
  }, []);
  return (
    <Container className="pb-24">
      <header className="page-header">
        <p className="eyebrow mb-5">Journey / Learning by building</p>
        <h1 className="page-title">
          Foundations first.
          <br />
          <span className="text-accent">More ambitious systems next.</span>
        </h1>
        <p className="intro">
          The progression of my studies and project work, and the direction I am
          moving in.
        </p>
      </header>
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-16">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <ol className="ml-1">
            {data.map((j, i) => (
              <li
                key={j.id}
                className={`journey-step ${/explor|goal/i.test(j.period) ? "current" : ""}`}
              >
                <div className="flex gap-3 flex-wrap items-center">
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-xl">{j.title}</h2>
                </div>
                {j.period && (
                  <p className="text-xs font-mono text-signal mt-2">
                    {j.period}
                  </p>
                )}
                <p className="text-muted leading-relaxed mt-3">
                  {j.description}
                </p>
              </li>
            ))}
          </ol>
        )}
        <aside className="self-start p-7 card-border bg-surface rounded-md md:sticky md:top-28">
          <p className="eyebrow mb-5">Education</p>
          {education.map((e) => (
            <div key={e.id}>
              <h2 className="font-display text-2xl">{e.degree}</h2>
              <p className="text-muted leading-relaxed mt-3">{e.institution}</p>
              {e.period && (
                <p className="text-sm text-signal mt-4">{e.period}</p>
              )}
              {e.description && (
                <p className="text-muted mt-4">{e.description}</p>
              )}
            </div>
          ))}
        </aside>
      </div>
    </Container>
  );
}
