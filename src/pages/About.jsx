import { useEffect } from "react";
import { FiArrowUpRight, FiBookOpen, FiMapPin } from "react-icons/fi";
import Container from "../components/common/Container";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import SocialLinks from "../components/common/SocialLinks";
import { useObject, useCollection } from "../hooks/useCollection";
import { profileService, educationService } from "../services/contentService";
import { setPageMeta } from "../utils/seo";
import Portrait from "../components/common/Portrait";
import { resumeUrl } from "../utils/links";
export default function About() {
  const { data: profile, loading, error } = useObject(profileService);
  const { data: education } = useCollection(educationService);
  useEffect(() => {
    setPageMeta({
      title: "About Mehmood Khan | AI Engineer",
      description:
        "Computer Science student at QUEST, Nawabshah, building RAG applications and learning the engineering behind intelligent systems.",
    });
  }, []);
  if (loading)
    return (
      <Container className="py-24">
        <LoadingState />
      </Container>
    );
  if (error)
    return (
      <Container className="py-24">
        <ErrorState />
      </Container>
    );
  return (
    <Container className="pb-20">
      <header className="page-header">
        <p className="eyebrow mb-5">About / Mehmood Khan</p>
        <h1 className="page-title">
          Curiosity is the start.
          <br />
          <span className="text-accent">Engineering is the work.</span>
        </h1>
      </header>
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-14 lg:gap-24">
        <div>
          <p className="text-xl leading-relaxed mb-8">{profile?.aboutShort}</p>
          <div className="space-y-6 text-muted leading-[1.8]">
            {profile?.aboutLong?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/projects">
              Explore my work <FiArrowUpRight />
            </Button>
            <Button to="/journey" variant="secondary">
              My journey
            </Button>
          </div>
          <SocialLinks profile={profile} className="mt-8" />
        </div>
        <aside>
          <div className="mb-6">
            <Portrait profile={profile} />
          </div>
          <div className="p-7 card-border rounded-md bg-surface">
            <FiBookOpen size={26} className="text-accent mb-6" />
            <p className="eyebrow mb-4">Currently studying</p>
            {education.map((e) => (
              <div key={e.id}>
                <h2 className="font-display text-2xl">{e.degree}</h2>
                <p className="text-muted leading-relaxed mt-3">
                  {e.institution}
                </p>
                {e.period && (
                  <p className="font-mono text-xs text-muted mt-4">
                    {e.period}
                  </p>
                )}
              </div>
            ))}
            <div className="mt-6 pt-5 border-t border-line text-sm text-muted flex items-center gap-2">
              <FiMapPin />
              {profile?.location}
            </div>
          </div>
          {resumeUrl(profile?.resumeUrl) && (
            <Button
              href={resumeUrl(profile.resumeUrl)}
              variant="secondary"
              className="mt-5 w-full"
              download="Mehmood-Khan-Resume.pdf"
            >
              Download résumé <FiArrowUpRight />
            </Button>
          )}
          <div className="border-l-2 border-accent pl-5 mt-8">
            <p className="eyebrow mb-3">Next focus</p>
            <p className="text-muted leading-relaxed">
              Retrieval evaluation, reliable AI backends, and agentic workflows
              with LangGraph.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
