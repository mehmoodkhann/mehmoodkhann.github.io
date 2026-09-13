import { useEffect } from "react";
import { FiLayers, FiCode, FiUsers } from "react-icons/fi";
import Container from "../components/common/Container";
import SocialLinks from "../components/common/SocialLinks";
import Button from "../components/common/Button";
import { resumeUrl } from "../utils/links";
import ContactForm from "../components/contact/ContactForm";
import { useObject } from "../hooks/useCollection";
import { profileService } from "../services/contentService";
import { setPageMeta } from "../utils/seo";
export default function Contact() {
  const { data: profile } = useObject(profileService);
  useEffect(() => {
    setPageMeta({
      title: "Contact Mehmood Khan | AI Projects & Opportunities",
      description:
        "Start a conversation about RAG applications, document intelligence, internships, and junior AI engineering opportunities.",
    });
  }, []);
  return (
    <Container className="py-16 md:py-24 grid md:grid-cols-2 gap-12 lg:gap-20">
      <div>
        <p className="eyebrow mb-5">Contact / Let's build something useful</p>
        <h1 className="page-title">
          Have an AI problem
          <br />
          <span className="text-accent">worth building?</span>
        </h1>
        <p className="mt-6 text-muted leading-relaxed text-lg max-w-lg">
          Tell me about the problem you want to solve. I'm open to focused
          development projects, internships, and junior AI engineering roles.
        </p>
        <SocialLinks profile={profile} includeEmail className="mt-8" />
        {resumeUrl(profile?.resumeUrl) && (
          <Button
            href={resumeUrl(profile.resumeUrl)}
            className="mt-5"
            variant="secondary"
            download="Mehmood-Khan-Resume.pdf"
          >
            Download resume
          </Button>
        )}
        <div className="mt-10 pt-7 border-t border-line space-y-5">
          {[
            [FiLayers, "RAG & document intelligence"],
            [FiCode, "AI applications & backend development"],
            [FiUsers, "Engineering teams & collaborations"],
          ].map(([Icon, label]) => (
            <p
              key={label}
              className="flex items-center gap-3 text-sm text-muted"
            >
              <Icon className="text-signal" />
              {label}
            </p>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs text-muted">
          {profile?.location || "Pakistan"} · Open to a conversation
        </p>
      </div>
      <div>
        <ContactForm profile={profile} />
      </div>
    </Container>
  );
}
