import { useEffect } from "react";
import { FiAward } from "react-icons/fi";
import Container from "../components/common/Container";
import CertificationCard from "../components/certifications/CertificationCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { certificationsService } from "../services/contentService";
import { useCollection } from "../hooks/useCollection";
import { setPageMeta } from "../utils/seo";

export default function Certifications() {
  const { data, loading, error } = useCollection(certificationsService);
  useEffect(
    () =>
      setPageMeta({
        title: "Certifications | Mehmood Khan",
        description:
          "Verified credentials and learning milestones from Mehmood Khan. Certifications will appear here when added.",
      }),
    [],
  );
  return (
    <Container className="pb-24">
      <header className="page-header">
        <p className="eyebrow mb-5">Certifications</p>
        <h1 className="page-title">
          Learning, <span className="text-accent">documented.</span>
        </h1>
        {data.length > 0 && (
          <p className="intro">
            Credentials and the skills developed along the way.
          </p>
        )}
      </header>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data.length ? (
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((c) => (
            <CertificationCard key={c.id} certification={c} />
          ))}
        </div>
      ) : (
        <div className="certification-empty">
          <FiAward className="text-accent" size={32} />
          <div>
            <h2 className="font-display text-2xl">
              Certifications coming soon.
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Completed credentials will be added here with their issuing
              details.
            </p>
          </div>
        </div>
      )}
    </Container>
  );
}
