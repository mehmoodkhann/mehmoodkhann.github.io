import { useEffect, useMemo, useState } from "react";
import Container from "../components/common/Container";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { ProjectFeature, ProjectRow } from "../components/projects/ProjectCard";
import ContactCta from "../components/home/ContactCta";
import { useCollection } from "../hooks/useCollection";
import { projectsService } from "../services/contentService";
import { setPageMeta } from "../utils/seo";
export default function Projects() {
  const { data: projects, loading, error } = useCollection(projectsService);
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(projects.flatMap((p) => p.technologies || []))],
    [projects],
  );
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.technologies?.includes(filter));
  useEffect(() => {
    setPageMeta({
      title: "AI Engineering Projects | Mehmood Khan",
      description:
        "Explore the Intelligent Research Paper Assistant, a RAG knowledge assistant, and Python application work.",
    });
  }, []);
  return (
    <>
      <Container>
        <header className="page-header">
          <p className="eyebrow mb-5">
            Selected work / Engineering in practice
          </p>
          <h1 className="page-title">
            The work behind
            <br />
            <span className="text-accent">the ideas.</span>
          </h1>
          <p className="intro">
            Document intelligence, retrieval systems, and usable applications.
            Explore the problem, the architecture, and my role in each project.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-t border-b border-line py-5 mb-10">
          <p className="text-sm text-muted" role="status">
            {loading
              ? "Loading projects…"
              : `${filtered.length} project${filtered.length === 1 ? "" : "s"}`}
          </p>
          <label
            htmlFor="technology-filter"
            className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm min-w-0"
          >
            Filter by technology
            <select
              id="technology-filter"
              className="fld sm:!w-auto sm:max-w-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : !filtered.length ? (
          <EmptyState
            title="No projects match this filter"
            action={
              <button onClick={() => setFilter("All")} className="text-link">
                Clear filter
              </button>
            }
          />
        ) : (
          filtered.map((p, i) =>
            p.id === "research-paper-assistant" ? (
              <ProjectFeature key={p.id} project={p} headingLevel={2} />
            ) : (
              <ProjectRow key={p.id} project={p} index={i + 1} headingLevel={2} />
            ),
          )
        )}
      </Container>
      <ContactCta />
    </>
  );
}
