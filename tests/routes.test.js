import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../dist/", import.meta.url);
const pages = JSON.parse(
  await readFile(new URL("route-manifest.json", root), "utf8"),
);
for (const page of pages) {
  test(`Static route ${page.path}: content, metadata, and local assets`, async () => {
    const file =
      page.path === "/404"
        ? "404.html"
        : join(page.path.slice(1), "index.html");
    const html = await readFile(new URL(file, root), "utf8");
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    let previousLevel = 0;
    for (const [, level] of html.matchAll(/<h([1-6])(?:\s|>)/g)) {
      assert.ok(Number(level) <= previousLevel + 1, `Heading jumps from h${previousLevel} to h${level}`);
      previousLevel = Number(level);
    }
    assert.ok(html.includes("<title>"));
    const encodedTitle = page.title
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
    const ogTitle = [...html.matchAll(/<meta\b[^>]*>/g)].find(([tag]) =>
      tag.includes('property="og:title"'),
    )?.[0];
    assert.ok(
      ogTitle?.includes('content="' + encodedTitle + '"'),
      "Page-specific Open Graph title",
    );
    assert.ok(html.includes('property="og:description"'));
    assert.ok(!html.includes("https://mehmoodkhan.dev"));
    assert.ok(!html.includes("Photo placeholder"));
    assert.ok(!html.includes("PLACEHOLDER"));
    if (!page.noindex)
      assert.ok(!/href="\/admin/.test(html), "No public admin navigation");
    assert.ok(!/href="\/blog/.test(html), "No blog links remain");
    if (page.noindex) assert.ok(html.includes("noindex, nofollow"));
    for (const match of html.matchAll(
      /(?:src|href|srcSet)="(\/(?:assets|images)\/[^"]+)"/g,
    ))
      await access(new URL(match[1].slice(1), root));
  });
}
test("Flagship details distinguish Hugging Face embeddings from Gemini generation", async () => {
  const html = await readFile(
    new URL("projects/research-paper-assistant/index.html", root),
    "utf8",
  );
  for (const term of [
    "Hugging Face",
    "Qdrant",
    "Gemini",
    "loader.py",
    "embedding.py",
    "rag_pipeline.py",
    "exceptions.py",
  ])
    assert.ok(html.includes(term), term);
  assert.ok(!html.includes("Gemini Embeddings"));
});
test("Knowledge Assistant includes source-verification limitation", async () => {
  const html = await readFile(
    new URL("projects/knowledge-assistant/index.html", root),
    "utf8",
  );
  assert.ok(html.includes("Application source was not supplied"));
  assert.ok(!html.includes("any document type"));
});
test("Contact controls are explicitly labelled; no local-save delivery promise remains", async () => {
  const html = await readFile(new URL("contact/index.html", root), "utf8");
  for (const id of ["name", "email", "message"])
    assert.ok(html.includes(`for="${id}"`) && html.includes(`id="${id}"`));
  assert.ok(!html.includes("Message received."));
});

test("Certifications has a truthful empty state and no seeded credentials", async () => {
  const html = await readFile(
    new URL("certifications/index.html", root),
    "utf8",
  );
  assert.ok(html.includes("Certifications coming soon."));
  assert.ok(!html.includes('class="certification-card"'));
  assert.ok(!pages.some((p) => p.path.startsWith("/blog")));
});
test("All three major projects have desktop and mobile technical covers", async () => {
  const html = await readFile(new URL("projects/index.html", root), "utf8");
  for (const id of [
    "research-paper-assistant",
    "knowledge-assistant",
    "network-traffic-monitor",
  ]) {
    for (const file of [id + ".svg", id + "-mobile.svg"]) {
      const svg = await readFile(new URL("images/" + file, root), "utf8");
      assert.ok(svg.includes("not a product screenshot"));
      assert.ok(html.includes("/images/" + file));
    }
  }
});
test("Identity, student status and case-study navigation remain visible", async () => {
  const home = await readFile(new URL("index.html", root), "utf8");
  assert.ok(home.includes("AI Engineer &amp; Intelligent Systems Builder"));
  assert.ok(home.includes("BS Computer Science student"));
  assert.ok(home.includes("Expected graduation 2027"));
  const html = await readFile(
    new URL("projects/research-paper-assistant/index.html", root),
    "utf8",
  );
  for (const id of [
    "overview",
    "problem",
    "solution",
    "architecture",
    "implementation",
    "stack",
    "decisions",
    "contribution",
    "value",
    "limitations",
  ])
    assert.ok(html.includes('id="' + id + '"'));
});
