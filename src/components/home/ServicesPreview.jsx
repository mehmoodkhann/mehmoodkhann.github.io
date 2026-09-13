import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import { useCollection } from "../../hooks/useCollection";
import { servicesService } from "../../services/contentService";
export default function ServicesPreview() {
  const { data, error } = useCollection(servicesService);
  if (error || !data.length) return null;
  return (
    <section className="section section-rule">
      <Container>
        <SectionHeading
          index="04"
          label="How I can help"
          title="Useful AI, built around your problem."
          action={
            <Link to="/services" className="text-link">
              Explore services <FiArrowUpRight />
            </Link>
          }
        />
        <div>
          {data.map((s, i) => (
            <div key={s.id} className="service-row">
              <span className="text-xs font-mono text-muted mt-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl">{s.title}</h3>
              <div>
                <p className="text-muted leading-relaxed">{s.problem}</p>
                <p className="mt-3 leading-relaxed">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
