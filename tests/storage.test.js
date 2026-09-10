import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createListService,
  getCollection,
  setCollection,
  resetCollection,
  exportContent,
} from "../src/services/storage.js";
import { profileService } from "../src/services/profileService.js";
import { messagesService } from "../src/services/messagesService.js";
import { authService } from "../src/services/authService.js";
import { defaultProfile } from "../src/data/defaultData.js";
import { webUrl, emailAddress } from "../src/utils/links.js";
import { validateContact } from "../src/utils/contact.js";
import {
  sendContactEmail,
  isEmailConfigured,
} from "../src/services/emailService.js";
let memory, events, failWrites;
beforeEach(() => {
  memory = new Map();
  events = [];
  failWrites = false;
  global.window = {
    localStorage: {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        if (failWrites) throw new Error("quota");
        memory.set(key, value);
      },
      removeItem: (key) => memory.delete(key),
    },
    dispatchEvent: (event) => events.push(event),
  };
});
test("Fresh collections use cloned defaults without mutating source data", () => {
  const a = getCollection("profile");
  a.name = "Changed";
  assert.equal(getCollection("profile").name, defaultProfile.name);
  assert.equal(memory.size, 0);
});
test("Every list collection preserves create, read, update and delete behavior", async () => {
  for (const collection of [
    "projects",
    "skills",
    "journey",
    "education",
    "expertise",
    "services",
    "certifications",
    "messages",
  ]) {
    const service = createListService(collection, "test");
    const count = (await service.list()).length;
    const item = await service.create({
      title: "Regression record",
      items: ["Python", "RAG"],
      nested: { keep: true },
    });
    assert.equal((await service.list()).length, count + 1);
    await service.update(item.id, { title: "Updated" });
    assert.deepEqual((await service.getById(item.id)).nested, { keep: true });
    assert.equal((await service.getById(item.id)).title, "Updated");
    await service.remove(item.id);
    assert.equal((await service.list()).length, count);
  }
});
test("Edited profile fields survive the default-content migration", async () => {
  await profileService.update({
    name: "Custom name",
    aboutLong: ["Custom paragraph"],
    email: "owner@portfolio.test",
  });
  const profile = await profileService.get();
  assert.equal(profile.name, "Custom name");
  assert.equal(profile.email, "owner@portfolio.test");
  assert.deepEqual(profile.aboutLong, ["Custom paragraph"]);
});
test("Known placeholder fields migrate without overwriting personal edits", () => {
  memory.set(
    "mk_portfolio_v1:profile",
    JSON.stringify({
      name: "Owner custom name",
      email: "PLACEHOLDER — add your email in /admin/settings",
      github: "https://github.com/PLACEHOLDER",
      linkedin: "https://linkedin.com/in/PLACEHOLDER",
      role: "Custom role",
    }),
  );
  const p = getCollection("profile");
  assert.equal(p.email, "");
  assert.equal(p.github, "");
  assert.equal(p.linkedin, "");
  assert.equal(p.name, "Owner custom name");
  assert.equal(p.role, "Custom role");
});
test("Arbitrary custom projects and draft articles survive migration", () => {
  memory.set(
    "mk_portfolio_v1:projects",
    JSON.stringify([
      {
        id: "custom",
        title: "User project",
        caseStudy: { overview: "Keep this" },
      },
    ]),
  );
  memory.set(
    "mk_portfolio_v1:blog",
    JSON.stringify([
      {
        id: "b1",
        title: "My own article",
        content: "Real custom content",
        published: false,
      },
    ]),
  );
  assert.equal(getCollection("projects")[0].title, "User project");
  assert.equal(exportContent().archivedBlog[0].content, "Real custom content");
});
test("Storage quota failures reject writes instead of reporting success", async () => {
  failWrites = true;
  await assert.rejects(
    profileService.update({ name: "Lost edit" }),
    /could not be saved/,
  );
  assert.equal(getCollection("profile").name, defaultProfile.name);
});
test("Corrupted content reports an error without overwriting browser records", () => {
  memory.set("mk_portfolio_v1:projects", "{invalid");
  assert.throws(() => getCollection("projects"), /could not be read/);
  assert.equal(memory.get("mk_portfolio_v1:projects"), "{invalid");
});
test("Local messages retain timestamp, delivery state, and read toggle", async () => {
  const message = await messagesService.submit({
    name: "Test",
    email: "test@portfolio.test",
    message: "Local test only",
    delivery: "local-only",
  });
  assert.equal(message.read, false);
  assert.ok(!Number.isNaN(Date.parse(message.receivedAt)));
  await messagesService.update(message.id, { read: true });
  assert.equal((await messagesService.getById(message.id)).read, true);
  assert.equal(
    (await messagesService.getById(message.id)).delivery,
    "local-only",
  );
});
test("Demo login, failed login, route-session flag, and logout remain functional", async () => {
  assert.equal(await authService.login("incorrect-test-value"), false);
  assert.equal(authService.isAuthenticated(), false);
  assert.equal(await authService.login("demo-admin"), true);
  assert.equal(authService.isAuthenticated(), true);
  await authService.logout();
  assert.equal(authService.isAuthenticated(), false);
});
test("Contact validation handles whitespace, invalid email, and long messages", () => {
  assert.deepEqual(
    Object.keys(
      validateContact({ name: "  ", email: "bad", message: " " }).errors,
    ),
    ["name", "email", "message"],
  );
  const valid = validateContact({
    name: " Test ",
    email: "test@portfolio.test ",
    message: " A focused project. ",
  });
  assert.deepEqual(valid.errors, {});
  assert.equal(valid.clean.name, "Test");
  assert.ok(
    validateContact({
      name: "Test",
      email: "t@portfolio.test",
      message: "x".repeat(5001),
    }).errors.message,
  );
});
test("Unconfigured email returns unsent and performs no delivery", async () => {
  assert.equal(isEmailConfigured, false);
  assert.deepEqual(
    await sendContactEmail({
      name: "Test",
      email: "test@portfolio.test",
      message: "No transmission",
    }),
    { sent: false, reason: "not_configured" },
  );
});
test("Unsafe and placeholder outbound links are hidden", () => {
  for (const value of [
    "javascript:alert(1)",
    "https://github.com/PLACEHOLDER",
    "data:text/html,hello",
    "",
  ])
    assert.equal(webUrl(value), "");
  assert.equal(
    webUrl("https://github.com/openai"),
    "https://github.com/openai",
  );
  assert.equal(emailAddress("PLACEHOLDER"), "");
  assert.equal(emailAddress("owner@portfolio.test"), "owner@portfolio.test");
});
test("Reset and backup preserve independent collections", () => {
  setCollection("messages", [{ id: "keep" }]);
  setCollection("profile", { ...defaultProfile, name: "Custom" });
  resetCollection("profile");
  assert.equal(getCollection("profile").name, defaultProfile.name);
  assert.equal(exportContent().messages[0].id, "keep");
  assert.ok(events.length >= 3);
});

test("V3 migration updates old defaults and preserves custom fields and removed rows", () => {
  memory.set("mk_portfolio_v1:redesign-v2:profile", "1");
  memory.set(
    "mk_portfolio_v1:profile",
    JSON.stringify({
      name: "Mehmood Khan",
      role: "AI Engineer · RAG & NLP",
      email: "real@portfolio.test",
      photoUrl: "/images/real-photo.webp",
    }),
  );
  const profile = getCollection("profile");
  assert.equal(profile.role, "AI Engineer & Intelligent Systems Builder");
  assert.equal(profile.email, "real@portfolio.test");
  assert.equal(profile.photoUrl, "/images/real-photo.webp");
  assert.ok(profile.heroHeadline);
  memory.set("mk_portfolio_v1:redesign-v2:skills", "1");
  memory.set(
    "mk_portfolio_v1:skills",
    JSON.stringify([
      {
        id: "s10",
        category: "Agentic AI",
        name: "LangGraph",
        level: "Learning",
      },
      {
        id: "s11",
        category: "My category",
        name: "AI Agents",
        level: "My custom level",
      },
    ]),
  );
  const skills = getCollection("skills");
  assert.equal(skills.length, 2, "Deleted default records are not resurrected");
  assert.equal(skills[0].level, "Currently Learning");
  assert.equal(skills[1].level, "My custom level");
  assert.deepEqual(
    getCollection("skills"),
    skills,
    "Migration is stable across reloads",
  );
});
test("Certifications start empty and retain every credential field through CRUD", async () => {
  const service = createListService("certifications", "cert");
  assert.deepEqual(await service.list(), []);
  const fields = {
    name: "Test credential",
    issuer: "Test issuer",
    issueDate: "2026-09-01",
    credentialId: "TEST-ONLY",
    credentialUrl: "https://credentials.portfolio.test/record",
    image: "/test-certificate.webp",
    skills: ["Python", "RAG"],
  };
  const saved = await service.create(fields);
  assert.deepEqual(await service.getById(saved.id), {
    ...fields,
    id: saved.id,
  });
  await service.update(saved.id, { skills: ["Python", "FastAPI"] });
  assert.equal(exportContent().certifications[0].credentialId, "TEST-ONLY");
  await service.remove(saved.id);
  assert.deepEqual(await service.list(), []);
});
