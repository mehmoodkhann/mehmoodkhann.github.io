import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiFileText,
  FiDatabase,
  FiMessageSquare,
} from "react-icons/fi";

// A concise introduction to the supplied flagship architecture. The full
// interactive explorer belongs in the case study, where it can be read in context.
export default function ProjectSpotlight({ project }) {
  return (
    <section className="project-spotlight" aria-labelledby="spotlight-title">
      <p className="eyebrow">Project in focus</p>
      <h2 id="spotlight-title" className="font-display">
        {project.title}
      </h2>
      <ol className="spotlight-flow" aria-label="Research assistant workflow">
        <li>
          <FiFileText aria-hidden="true" />
          <div>
            <h3>Prepare the documents</h3>
            <p>PDF processing · Hugging Face embeddings</p>
          </div>
        </li>
        <li>
          <FiDatabase aria-hidden="true" />
          <div>
            <h3>Retrieve relevant context</h3>
            <p>Semantic search in Qdrant Cloud</p>
          </div>
        </li>
        <li>
          <FiMessageSquare aria-hidden="true" />
          <div>
            <h3>Generate an answer</h3>
            <p>Google Gemini with retrieved context</p>
          </div>
        </li>
      </ol>
      <Link to={`/projects/${project.id}`} className="text-link">
        Explore the case study <FiArrowUpRight aria-hidden="true" />
      </Link>
    </section>
  );
}
