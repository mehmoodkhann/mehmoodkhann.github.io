import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import Hero from "../src/components/home/Hero";
import CertificationCard from "../src/components/certifications/CertificationCard";
import Field from "../src/components/admin/Field";
import { ProjectRow } from "../src/components/projects/ProjectCard";
export const renderHero = (profile, project) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <Hero profile={profile} project={project} />
    </MemoryRouter>,
  );
export const renderCertificate = (c) =>
  renderToStaticMarkup(<CertificationCard certification={c} />);
export const renderField = () =>
  renderToStaticMarkup(
    <Field label="Test label">
      <input id="custom-control" />
    </Field>,
  );
export const renderProject = (p, headingLevel = 3) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <ProjectRow project={p} headingLevel={headingLevel} />
    </MemoryRouter>,
  );
