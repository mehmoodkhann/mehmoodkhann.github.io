import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import { ProjectFeature, ProjectRow } from "../projects/ProjectCard";
import { useCollection } from "../../hooks/useCollection";
import { projectsService } from "../../services/projectsService";
export default function FeaturedProjects() {
  const { data, loading, error } = useCollection(projectsService);
  const featured = data.filter((p) => p.featured);
  const main =
    featured.find((p) => p.id === "research-paper-assistant") || featured[0];
  return (
    <section id="selected-work" className="section">
      <Container>
        <SectionHeading
          index="01"
          label="Selected work"
          title="Ideas, engineered into applications."
          description="A closer look at the systems I build, the problems behind them, and the architecture that connects the pieces."
          action={
            <Link to="/projects" className="text-link whitespace-nowrap">
              All projects <FiArrowUpRight />
            </Link>
          }
        />
        {loading ? (
          <LoadingState label="Loading projects" />
        ) : error ? (
          <ErrorState />
        ) : !main ? (
          <EmptyState title="Projects are being updated" />
        ) : (
          <>
            {main.id === "research-paper-assistant" ? (
              <ProjectFeature project={main} />
            ) : (
              <ProjectRow project={main} index={1} />
            )}
            <div className="mt-4">
              {featured
                .filter((p) => p.id !== main.id)
                .map((p, i) => (
                  <ProjectRow key={p.id} project={p} index={i + 2} />
                ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
