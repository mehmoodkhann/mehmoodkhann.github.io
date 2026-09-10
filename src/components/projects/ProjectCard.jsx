import { Link } from "react-router-dom";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { webUrl } from "../../utils/links";
import ProjectCover from "./ProjectCover";
function ProjectLinks({ project }) {
  return (
    <div className="project-links">
      <Link to={`/projects/${project.id}`} className="text-link text-signal">
        View case study <FiArrowUpRight size={17} />
      </Link>
      {webUrl(project.githubUrl) && (
        <a
          className="text-link"
          href={webUrl(project.githubUrl)}
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub /> GitHub
        </a>
      )}
      {webUrl(project.liveUrl) && (
        <a
          className="text-link"
          href={webUrl(project.liveUrl)}
          target="_blank"
          rel="noreferrer"
        >
          Live demo <FiArrowUpRight />
        </a>
      )}
    </div>
  );
}
export function ProjectFeature({ project, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="project-feature">
      <ProjectCover project={project} to={`/projects/${project.id}`} className="project-feature-visual" />
      <div className="project-feature-content">
        <p className="eyebrow mb-5">
          Featured / {project.category || "AI application"}
        </p>
        <Heading className="project-card-title font-display text-3xl md:text-4xl leading-[1.17] tracking-[-.035em]">
          <Link
            className="hover:text-accent transition-colors"
            to={`/projects/${project.id}`}
          >
            {project.title}
          </Link>
        </Heading>
        {project.summary && <p className="mt-5 text-muted leading-relaxed">{project.summary}</p>}
        {project.technologies?.length > 0 && <ul className="flex flex-wrap gap-2 mt-6" aria-label="Key technologies">
          {project.technologies?.slice(0, 5).map((t) => (
            <li className="tech-tag" key={t}>
              {t}
            </li>
          ))}
        </ul>}
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
export function ProjectRow({ project, index = 2, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="project-row">
      <ProjectCover project={project} to={`/projects/${project.id}`} />
      <div className="min-w-0">
        <p className="eyebrow mb-3">
          {String(index).padStart(2, "0")}
          {(project.category || project.role) && ` / ${project.category || project.role}`}
        </p>
        <Heading className="project-card-title font-display text-2xl md:text-3xl transition-colors">
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </Heading>
        {project.summary && <p className="text-muted mt-3 leading-relaxed max-w-2xl">
          {project.summary}
        </p>}
        {project.technologies?.length > 0 && <ul className="flex flex-wrap gap-2 mt-5" aria-label="Key technologies">
          {project.technologies?.slice(0, 4).map((t) => (
            <li className="tech-tag" key={t}>
              {t}
            </li>
          ))}
        </ul>}
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}
