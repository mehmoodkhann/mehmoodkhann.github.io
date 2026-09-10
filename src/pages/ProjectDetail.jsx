import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiGithub,
  FiExternalLink,
  FiVideo,
  FiCheck,
} from "react-icons/fi";
import Container from "../components/common/Container";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import PipelineFlow from "../components/common/PipelineFlow";
import Button from "../components/common/Button";
import ProjectCover from "../components/projects/ProjectCover";
import ArchitectureExplorer from "../components/projects/ArchitectureExplorer";
import CaseNavigation from "../components/projects/CaseNavigation";
import { useCollection } from "../hooks/useCollection";
import { projectsService } from "../services/projectsService";
import { setPageMeta } from "../utils/seo";
import { webUrl, imageUrl } from "../utils/links";
function Section({ id, title, children }) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-heading`}
      className="case-section"
    >
      <h2 id={`${id}-heading`}>{title}</h2>
      {children}
    </section>
  );
}
export default function ProjectDetail() {
  const { id } = useParams();
  const { data, loading, error } = useCollection(projectsService);
  const project = data.find((p) => p.id === id);
  useEffect(() => {
    if (!loading)
      setPageMeta({
        title: project
          ? `${project.title} | Mehmood Khan`
          : "Project not found | Mehmood Khan",
        description: project?.summary || "This project is unavailable.",
        noindex: !project,
        image: imageUrl(project?.coverImage),
      });
  }, [project, loading]);
  if (loading)
    return (
      <Container className="py-24">
        <LoadingState label="Loading project" />
      </Container>
    );
  if (error)
    return (
      <Container className="py-24">
        <ErrorState />
      </Container>
    );
  if (!project)
    return (
      <Container className="py-24">
        <h1 className="page-title mb-8">Project not found.</h1>
        <EmptyState
          title="This project may have moved."
          action={<Button to="/projects">Back to projects</Button>}
        />
      </Container>
    );
  const cs = project.caseStudy || {};
  const flagship = project.id === "research-paper-assistant";
  const anchors = [
    ["overview", "Overview"],
    ...(cs.problem ? [["problem", "The problem"]] : []),
    ...(cs.solution ? [["solution", "The solution"]] : []),
    ...(project.pipeline?.length ? [["architecture", "Architecture"]] : []),
    ...(cs.implementation?.length
      ? [["implementation", "Implementation"]]
      : []),
    ["stack", "Technology stack"],
    ...(cs.engineeringDecisions
      ? [["decisions", "Engineering decisions"]]
      : []),
    ["contribution", "My contribution"],
    ["value", "Results & value"],
    ...(cs.limitations || cs.evidence ? [["limitations", "Limitations"]] : []),
    ...(project.screenshots?.some(imageUrl)
      ? [["screenshots", "Screenshots"]]
      : []),
  ];
  return (
    <article>
      <div className="border-b border-line">
        <Container>
          <header className="page-header">
            <Link to="/projects" className="text-link text-muted mb-8">
              <FiArrowLeft />
              All projects
            </Link>
            <p className="eyebrow mb-5">
              {flagship ? "Engineering case study" : "Project overview"} /{" "}
              {project.category || project.role}
            </p>
            <h1 className="page-title max-w-4xl">{project.title}</h1>
            <p className="intro">{project.summary}</p>
            <dl className="case-facts">
              <div>
                <dt>My role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>{project.category}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 mt-7">
              {webUrl(project.githubUrl) && (
                <Button href={webUrl(project.githubUrl)} variant="secondary">
                  <FiGithub />
                  Source code
                </Button>
              )}
              {webUrl(project.liveUrl) && (
                <Button href={webUrl(project.liveUrl)} variant="secondary">
                  <FiExternalLink />
                  Live demo
                </Button>
              )}
              {webUrl(project.videoUrl) && (
                <Button href={webUrl(project.videoUrl)} variant="secondary">
                  <FiVideo />
                  Video demo
                </Button>
              )}
              <Button to="/contact" variant="ghost">
                Discuss this project <FiArrowUpRight />
              </Button>
            </div>
          </header>
          <ProjectCover
            project={project}
            priority
            className="case-cover mb-10"
          />
        </Container>
      </div>
      <Container className="case-layout">
        <CaseNavigation anchors={anchors} />
        <div>
          <Section id="overview" title="Project overview">
            <p>{cs.overview || project.summary}</p>
            {project.capabilities?.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-4 mt-8">
                {project.capabilities.map((c) => (
                  <li key={c} className="flex gap-3 leading-relaxed">
                    <FiCheck className="text-accent mt-1" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </Section>
          {cs.problem && (
            <Section id="problem" title="The problem">
              <p>{cs.problem}</p>
            </Section>
          )}
          {cs.solution && (
            <Section id="solution" title="The solution">
              <p>{cs.solution}</p>
            </Section>
          )}
          {project.pipeline?.length > 0 && (
            <Section
              id="architecture"
              title={flagship ? "AI / RAG architecture" : "System workflow"}
            >
              {imageUrl(project.architectureDiagram) ? (
                <img
                  src={imageUrl(project.architectureDiagram)}
                  alt={`${project.title} system architecture`}
                  loading="lazy"
                  className="w-full mb-8"
                />
              ) : null}
              {flagship ? (
                <div className="max-w-xl mb-8">
                  <ArchitectureExplorer />
                </div>
              ) : null}
              <h3 className="font-display text-xl mb-5">
                {flagship ? "The complete RAG pipeline" : "How it works"}
              </h3>
              <PipelineFlow steps={project.pipeline} />
              {cs.architectureSteps?.length > 0 && (
                <dl className="mt-8 grid sm:grid-cols-2 gap-8">
                  {cs.architectureSteps.map((s) => (
                    <div key={s.step}>
                      <dt className="font-medium mb-2">{s.step}</dt>
                      <dd className="text-muted leading-relaxed">
                        {s.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Section>
          )}
          {cs.implementation?.length > 0 && (
            <Section id="implementation" title="Inside the backend">
              <p>
                Responsibilities are separated across the processing, retrieval,
                conversation, and support layers.
              </p>
              <div className="mt-6">
                {cs.implementation.map((group) => (
                  <div className="implementation-row" key={group.title}>
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        {group.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        {group.files.map((f) => (
                          <code key={f}>{f}</code>
                        ))}
                      </div>
                    </div>
                    <p>{group.detail}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
          <Section id="stack" title="The technology stack">
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>
            {cs.whyTheseTools?.length > 0 && (
              <dl className="mt-8 space-y-6">
                {cs.whyTheseTools.map((t) => (
                  <div key={t.tool}>
                    <dt className="font-medium mb-1">{t.tool}</dt>
                    <dd className="text-muted leading-relaxed">
                      {t.reason}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>
          {cs.engineeringDecisions && (
            <Section id="decisions" title="Engineering decisions">
              <p>{cs.engineeringDecisions}</p>
            </Section>
          )}
          <Section id="contribution" title="My contribution">
            <p>{project.contribution || project.role}</p>
            {cs.challenges && (
              <div className="mt-6">
                <h3 className="font-display text-xl mb-2">Challenges</h3>
                <p>{cs.challenges}</p>
              </div>
            )}
          </Section>
          <Section id="value" title="Results & practical value">
            <p>
              {cs.value ||
                "This project brings its workflow into a single application."}
            </p>
            {cs.results && <p className="mt-5">{cs.results}</p>}
          </Section>
          {(cs.limitations || cs.evidence) && (
            <Section id="limitations" title="Limitations & evidence">
              {cs.limitations && <p>{cs.limitations}</p>}
              {cs.evidence && (
                <div className="status-note mt-6 text-muted">{cs.evidence}</div>
              )}
            </Section>
          )}
          {project.screenshots?.some(imageUrl) && (
            <Section id="screenshots" title="Project screenshots">
              <div className="grid gap-6">
                {project.screenshots.filter(imageUrl).map((src, i) => (
                  <a
                    key={src}
                    href={imageUrl(src)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open screenshot ${i + 1}`}
                  >
                    <img
                      loading="lazy"
                      src={imageUrl(src)}
                      className="card-border rounded-md w-full"
                      alt={`${project.title}, screenshot ${i + 1}`}
                    />
                  </a>
                ))}
              </div>
            </Section>
          )}
          <div className="py-12 flex flex-wrap justify-between gap-5">
            <Button to="/projects" variant="secondary">
              <FiArrowLeft />
              All projects
            </Button>
            <Button to="/contact">
              Let's talk <FiArrowUpRight />
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
