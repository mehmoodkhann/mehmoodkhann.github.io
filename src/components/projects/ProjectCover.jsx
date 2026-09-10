import { useState } from "react";
import { Link } from "react-router-dom";
import { imageUrl } from "../../utils/links";
const diagrams = new Set([
  "research-paper-assistant",
  "knowledge-assistant",
  "network-traffic-monitor",
]);
export default function ProjectCover({
  project,
  priority = false,
  className = "",
  to,
}) {
  const [failed, setFailed] = useState("");
  const fallback = diagrams.has(project.id) ? `/images/${project.id}.svg` : "";
  const requested = imageUrl(project.coverImage);
  const src = requested && requested !== failed ? requested : fallback;
  if (!src) return null;
  const diagram = src === fallback;
  const picture = (
    <picture>
      {diagram && (
        <source
          media="(max-width: 639px)"
          srcSet={`/images/${project.id}-mobile.svg`}
        />
      )}
      <img
        src={src}
        width="960"
        height="600"
        alt={project.coverAlt || `${project.title} project cover`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => {
          if (src !== fallback) setFailed(src);
        }}
      />
    </picture>
  );
  return (
    <figure className={`project-cover ${className}`}>
      {to ? (
        <Link
          to={to}
          className="project-cover-link"
          aria-label={`View ${project.title} case study`}
        >
          {picture}
        </Link>
      ) : picture}
      {diagram && (
        <figcaption>
          {project.id === "knowledge-assistant"
            ? "Conceptual RAG workflow"
            : "Architecture overview"}
        </figcaption>
      )}
    </figure>
  );
}
