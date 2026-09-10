import test, { after } from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { build } from "vite";
import react from "@vitejs/plugin-react";
await build({
  configFile: false,
  plugins: [react()],
  logLevel: "silent",
  build: {
    ssr: "tests/render-fixtures.jsx",
    outDir: ".test-render",
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "render.mjs" } },
  },
});
const { renderHero, renderCertificate, renderField, renderProject } =
  await import("../.test-render/render.mjs");
after(() => rm(".test-render", { recursive: true, force: true }));
test("Hero uses the supplied portrait and resume; absent portraits remain absent", () => {
  const profile = {
    name: "Test person",
    photoUrl: "/images/real-person.webp",
    resumeUrl: "/resume.pdf",
    status: "Test status",
  };
  const html = renderHero(profile);
  assert.ok(html.includes('src="/images/real-person.webp"'));
  assert.ok(html.includes('alt="Portrait of Test person"'));
  assert.ok(html.includes('href="/resume.pdf"'));
  assert.ok(!renderHero({ ...profile, photoUrl: "" }).includes("<img"));
});
test("Certificate presentation includes actual fields and hides unsafe credential URLs", () => {
  const cert = {
    name: "Test certificate",
    issuer: "Test issuer",
    issueDate: "2026-09-01",
    credentialId: "TEST-ONLY",
    credentialUrl: "https://credential.portfolio.test/verify",
    image: "/certificate.webp",
    skills: ["Python"],
  };
  const html = renderCertificate(cert);
  for (const value of [
    "Test certificate",
    "Test issuer",
    "TEST-ONLY",
    "Python",
    "1 September 2026",
    'href="https://credential.portfolio.test/verify"',
  ])
    assert.ok(html.includes(value));
  assert.ok(
    !renderCertificate({
      ...cert,
      credentialUrl: "javascript:alert(1)",
    }).includes("javascript:"),
  );
});
test("Field label targets an explicitly supplied control ID", () => {
  const html = renderField();
  assert.ok(html.includes('for="custom-control"'));
  assert.ok(html.includes('id="custom-control"'));
});
test("Secondary project cards expose valid source and demo links", () => {
  const html = renderProject({
    id: "test-project",
    title: "Test project",
    githubUrl: "https://github.com/test/project",
    liveUrl: "https://demo.portfolio.test",
    technologies: ["Python"],
  });
  assert.ok(html.includes('href="https://github.com/test/project"'));
  assert.ok(html.includes('href="https://demo.portfolio.test/"'));
  assert.ok(html.includes('href="/projects/test-project"'));
});
test("Hero gives a short route into actual work without inventing a portrait or empty links", () => {
  const project = { id: "research-paper-assistant", title: "Research assistant" };
  const html = renderHero({ name: "Test person" }, project);
  assert.ok(html.includes('href="/projects/research-paper-assistant"'));
  assert.ok(html.includes("Hugging Face embeddings"));
  assert.ok(html.includes("Qdrant Cloud"));
  assert.ok(html.includes("Google Gemini"));
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("hero-links"));
  assert.ok(!html.includes("aria-pressed"), "Full interactive explorer remains in the case study");
  assert.ok(!renderHero({ name: "Test person" }).includes("project-spotlight"));
  const portrait = renderHero({ name: "Test person", photoUrl: "/real-photo.webp" }, project);
  assert.ok(portrait.includes('src="/real-photo.webp"'));
  assert.ok(!portrait.includes("project-spotlight"));
});
test("Custom projects support linked covers, correct heading levels, and absent images", () => {
  const project = { id: "custom-project", title: "Custom project", coverImage: "/images/custom.webp" };
  const html = renderProject(project, 2);
  assert.match(html, /<h2\b[^>]*>/);
  const imageLink = html.match(/<a\b[^>]*><picture>/)?.[0];
  assert.ok(imageLink?.includes('href="/projects/custom-project"'));
  assert.ok(imageLink?.includes('aria-label="View Custom project case study"'));
  assert.ok(html.includes('src="/images/custom.webp"'));
  const textOnly = renderProject({ ...project, coverImage: "" }, 2);
  assert.ok(textOnly.includes("Custom project"));
  assert.ok(!textOnly.includes("<figure"));
  assert.ok(!textOnly.includes("<img"));
});
