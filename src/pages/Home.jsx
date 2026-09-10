import { useEffect } from "react";
import Hero from "../components/home/Hero";
import FeaturedProjects from "../components/home/FeaturedProjects";
import ExpertisePreview from "../components/home/ExpertisePreview";
import JourneyPreview from "../components/home/JourneyPreview";
import ContactCta from "../components/home/ContactCta";
import ServicesPreview from "../components/home/ServicesPreview";
import CertificationsPreview from "../components/home/CertificationsPreview";
import { useObject, useCollection } from "../hooks/useCollection";
import { projectsService } from "../services/projectsService";
import { profileService } from "../services/profileService";
import { settingsService } from "../services/settingsService";
import { setPageMeta } from "../utils/seo";
export default function Home() {
  const { data: profile } = useObject(profileService);
  const { data: settings } = useObject(settingsService);
  const { data: projects } = useCollection(projectsService);
  useEffect(() => {
    setPageMeta({
      title:
        settings?.siteTitle ||
        "Mehmood Khan | AI Engineer & Intelligent Systems Builder",
      description:
        settings?.siteDescription ||
        "Emerging AI engineer building document assistants and RAG applications with Python, FastAPI, LangChain, Qdrant, and React.",
    });
  }, [settings]);
  return (
    <>
      <Hero
        profile={profile}
        project={projects.find((p) => p.id === "research-paper-assistant")}
      />
      <FeaturedProjects />
      <ExpertisePreview />
      <JourneyPreview />
      <CertificationsPreview />
      <ServicesPreview />
      <ContactCta />
    </>
  );
}
