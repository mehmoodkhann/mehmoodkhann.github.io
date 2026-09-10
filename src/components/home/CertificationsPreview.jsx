import { Link } from "react-router-dom";
import { FiArrowUpRight, FiAward } from "react-icons/fi";
import Container from "../common/Container";
import { useCollection } from "../../hooks/useCollection";
import { certificationsService } from "../../services/certificationsService";

export default function CertificationsPreview() {
  const { data, error } = useCollection(certificationsService);
  if (error || !data.length) return null;
  return (
    <section className="section section-rule">
      <Container>
        <div className="section-heading">
          <div>
            <p className="eyebrow mb-4">Certifications</p>
            <h2>Learning, documented.</h2>
          </div>
          <Link to="/certifications" className="text-link">
            All credentials <FiArrowUpRight />
          </Link>
        </div>
        <ul className="grid md:grid-cols-2 gap-6">
          {data.slice(0, 2).map((c) => (
            <li key={c.id} className="flex gap-5 border-t border-line pt-6">
              <FiAward className="text-accent mt-1" size={24} />
              <div>
                <h3 className="font-display text-xl">
                  <Link to="/certifications">{c.name}</Link>
                </h3>
                <p className="text-muted mt-2">{c.issuer}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
