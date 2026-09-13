import { useEffect } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import ContactCta from "../components/home/ContactCta";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { useCollection } from "../hooks/useCollection";
import { servicesService } from "../services/contentService";
import { setPageMeta } from "../utils/seo";
export default function Services() {
  const { data, loading, error } = useCollection(servicesService);
  useEffect(() => {
    setPageMeta({
      title: "AI Development Services | Mehmood Khan",
      description:
        "Focused RAG prototypes, document-processing workflows, and AI application development with Python, FastAPI, and React.",
    });
  }, []);
  return (
    <>
      <Container>
        <header className="page-header">
          <p className="eyebrow mb-5">Services / From idea to application</p>
          <h1 className="page-title">
            Put your knowledge
            <br />
            <span className="text-accent">to work.</span>
          </h1>
          <p className="intro">
            Focused AI development for document-heavy workflows. I work on
            scoped applications and prototypes, with a clear problem and a
            practical deliverable.
          </p>
          <div className="mt-7">
            <Button to="/projects" variant="secondary">
              See the work behind the skills <FiArrowUpRight />
            </Button>
          </div>
        </header>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : !data.length ? (
          <EmptyState title="Services are being updated" />
        ) : (
          data.map((s, i) => (
            <section className="service-row" key={s.id}>
              <span className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-2xl">{s.title}</h2>
                <div className="flex flex-wrap gap-2 mt-5">
                  {s.items?.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="eyebrow mb-2">The problem</p>
                  <p className="text-muted leading-relaxed">{s.problem}</p>
                </div>
                <div>
                  <p className="eyebrow mb-2">What I can build</p>
                  <p className="text-muted leading-relaxed">{s.solution}</p>
                </div>
                <p className="leading-relaxed border-l-2 border-accent pl-4">
                  {s.value}
                </p>
              </div>
            </section>
          ))
        )}
      </Container>
      <ContactCta />
    </>
  );
}
