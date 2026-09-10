import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import Container from "../common/Container";
import Button from "../common/Button";
import SocialLinks from "../common/SocialLinks";
import Portrait from "../common/Portrait";
import ProjectSpotlight from "./ProjectSpotlight";
import { resumeUrl, webUrl } from "../../utils/links";

export default function Hero({ profile, project }) {
  const resume = resumeUrl(profile?.resumeUrl);
  const hasLinks = resume || webUrl(profile?.github) || webUrl(profile?.linkedin);
  return (
    <section aria-labelledby="hero-heading" className="hero-section">
      <Container>
        <div className="hero-layout">
          <div className="reveal min-w-0">
            <p className="hero-name">
              {profile?.name || "Mehmood Khan"}
              <span className="text-accent">.</span>
            </p>
            <p className="hero-role">
              {profile?.role || "AI Engineer & Intelligent Systems Builder"}
            </p>
            <h1 id="hero-heading" className="hero-heading font-display">
              {profile?.heroHeadline ||
                "Turning complex knowledge into practical AI systems."}
            </h1>
            <p className="hero-specializations">
              {profile?.specializations ||
                "NLP · RAG · LLM Applications · Agentic AI"}
            </p>
            {profile?.tagline && (
              <p className="hero-copy mt-5">{profile.tagline}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/projects">
                View my work <FiArrowUpRight size={17} />
              </Button>
              <Button to="/contact" variant="secondary">
                Let's talk
              </Button>
            </div>
            {hasLinks && (
              <div className="hero-links mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <SocialLinks profile={profile} />
                {resume && (
                  <a
                    className="text-link text-muted min-h-11"
                    href={resume}
                    download="Mehmood-Khan-Resume.pdf"
                  >
                    <FiDownload /> Download resume
                  </a>
                )}
              </div>
            )}
            <p className="hero-status">
              {profile?.status || "BS Computer Science student"}
              <span>QUEST, Nawabshah · Expected graduation 2027</span>
            </p>
          </div>
          <div className="hero-media min-w-0 reveal">
            <Portrait
              profile={profile}
              priority
              fallback={project ? <ProjectSpotlight project={project} /> : null}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
