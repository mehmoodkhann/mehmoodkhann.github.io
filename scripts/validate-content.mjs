import { access } from "node:fs/promises";
import path from "node:path";
import {
  defaultCertifications,
  defaultEducation,
  defaultExpertise,
  defaultJourney,
  defaultProfile,
  defaultProjects,
  defaultServices,
  defaultSettings,
  defaultSkills,
} from "../src/data/defaultData.js";

const root = process.cwd();
const errors = [];

function required(value, label) {
  if (typeof value !== "string" || !value.trim())
    errors.push(`${label} is required.`);
}

function uniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    required(item.id, `${label} id`);
    if (seen.has(item.id)) errors.push(`${label} id is duplicated: ${item.id}`);
    seen.add(item.id);
  }
}

function localAsset(value, label) {
  if (!value || value.startsWith("data:") || /^https?:\/\//i.test(value)) return;
  const relative = value.replace(/^\//, "");
  if (relative.includes("..")) {
    errors.push(`${label} contains a parent path: ${value}`);
    return;
  }
  assets.push(
    access(path.join(root, "public", relative)).catch(() => {
      errors.push(`${label} does not exist: ${value}`);
    }),
  );
}

const assets = [];

required(defaultProfile.name, "profile.name");
required(defaultProfile.role, "profile.role");
required(defaultProfile.aboutShort, "profile.aboutShort");
required(defaultSettings.siteTitle, "settings.siteTitle");
required(defaultSettings.siteDescription, "settings.siteDescription");

for (const [label, items] of [
  ["expertise", defaultExpertise],
  ["skills", defaultSkills],
  ["projects", defaultProjects],
  ["journey", defaultJourney],
  ["education", defaultEducation],
  ["services", defaultServices],
  ["certifications", defaultCertifications],
]) {
  uniqueIds(items, label);
}

for (const project of defaultProjects) {
  required(project.title, `project ${project.id}.title`);
  required(project.summary, `project ${project.id}.summary`);
  localAsset(project.coverImage, `project ${project.id}.coverImage`);
  localAsset(
    project.architectureDiagram,
    `project ${project.id}.architectureDiagram`,
  );
  for (const [index, screenshot] of (project.screenshots || []).entries())
    localAsset(screenshot, `project ${project.id}.screenshots[${index}]`);
}

localAsset(defaultProfile.photoUrl, "profile.photoUrl");
localAsset(defaultProfile.resumeUrl, "profile.resumeUrl");
for (const certification of defaultCertifications)
  localAsset(certification.image, `certification ${certification.id}.image`);

await Promise.all(assets);

if (errors.length) {
  console.error("Portfolio content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Portfolio content valid: ${defaultProjects.length} projects, ${defaultSkills.length} skills, ${defaultCertifications.length} certifications, and ${assets.length} local asset references checked.`,
);