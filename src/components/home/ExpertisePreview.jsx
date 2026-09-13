import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiLayers,
  FiServer,
  FiDatabase,
  FiLayout,
  FiCode,
  FiGitBranch,
} from "react-icons/fi";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { useCollection } from "../../hooks/useCollection";
import { expertiseService } from "../../services/contentService";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
const icons = [FiLayers, FiServer, FiDatabase, FiLayout, FiCode, FiGitBranch];
export default function ExpertisePreview() {
  const { data, loading, error } = useCollection(expertiseService);
  return (
    <section className="section section-rule bg-surface/40">
      <Container>
        <SectionHeading
          index="02"
          label="Engineering toolkit"
          title="A stack with a purpose."
          description="From the first document upload to the response on screen."
          action={
            <Link className="text-link" to="/expertise">
              Explore my skills <FiArrowUpRight />
            </Link>
          }
        />
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
            {data.map((group, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={group.id} className="skill-block">
                  <Icon size={24} className="text-accent mb-5" />
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3>{group.title}</h3>
                    {group.id === "agentic-ai" && (
                      <span className="tech-tag">Exploring</span>
                    )}
                  </div>
                  <p className="text-muted leading-relaxed mt-3">
                    {group.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items?.map((item) => (
                      <li className="tech-tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
