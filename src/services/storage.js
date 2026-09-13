import {
  defaultProfile,
  defaultExpertise,
  defaultSkills,
  defaultProjects,
  defaultJourney,
  defaultEducation,
  defaultCertifications,
  defaultSettings,
  defaultMessages,
  defaultServices,
} from "../data/defaultData.js";
import { legacyFingerprints } from "../data/legacyFingerprints.js";
import { v2Fingerprints } from "../data/v2Fingerprints.js";
const NAMESPACE = "mk_portfolio_v1";
const SEEDS = {
  profile: defaultProfile,
  expertise: defaultExpertise,
  skills: defaultSkills,
  projects: defaultProjects,
  journey: defaultJourney,
  education: defaultEducation,
  certifications: defaultCertifications,
  settings: defaultSettings,
  messages: defaultMessages,
  services: defaultServices,
};
const key = (collection) => `${NAMESPACE}:${collection}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const hash = (value) => {
  let h = 2166136261;
  for (const c of JSON.stringify(value)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
};
function readRaw(collection) {
  let raw;
  try {
    raw = window.localStorage.getItem(key(collection));
  } catch {
    return undefined;
  }
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(
      "Saved content could not be read. Export your browser data before resetting this collection.",
    );
  }
}
function writeRaw(collection, value) {
  try {
    window.localStorage.setItem(key(collection), JSON.stringify(value));
  } catch {
    throw new Error(
      "Changes could not be saved. Browser storage may be full or unavailable. Reduce upload sizes or enable site storage, then try again.",
    );
  }
}
async function loadCollection(collection) {
  const value = getCollection(collection);
  return clone(value);
}
function persistCollection(collection, value) {
  const next = clone(value);
  writeRaw(collection, next);
  window.dispatchEvent(
    new CustomEvent("portfolio:content", { detail: { collection } }),
  );
  return next;
}
function migrate(collection, value) {
  let migrated;
  try {
    migrated = window.localStorage.getItem(key("redesign-v2:" + collection));
  } catch {
    return value;
  }
  if (migrated || !legacyFingerprints[collection]) return value;
  const fingerprints = legacyFingerprints[collection];
  let next;
  if (Array.isArray(value)) {
    next = value.flatMap((item) => {
      if (fingerprints[item.id] !== hash(item)) return [item];
      const replacement = SEEDS[collection].find((seed) => seed.id === item.id);
      return replacement ? [clone(replacement)] : [];
    });
  } else {
    next = { ...value };
    for (const [field, newValue] of Object.entries(SEEDS[collection])) {
      if (
        value[field] === undefined ||
        fingerprints[field] === hash(value[field])
      )
        next[field] = clone(newValue);
    }
  }
  try {
    writeRaw(collection, next);
    window.localStorage.setItem(key("redesign-v2:" + collection), "1");
  } catch {
    return next;
  }
  return next;
}
function migrateV3(collection, value) {
  const baseline = v2Fingerprints[collection];
  if (!baseline) return value;
  const marker = key("redesign-v3:" + collection);
  try {
    if (window.localStorage.getItem(marker)) return value;
  } catch {
    return value;
  }
  let next;
  if (baseline.whole === hash(value)) next = clone(SEEDS[collection]);
  else if (Array.isArray(value)) {
    next = value.map((item) => {
      const seed = SEEDS[collection].find((s) => s.id === item.id);
      return seed && baseline.fields[item.id] === hash(item)
        ? clone(seed)
        : item;
    });
  } else {
    next = { ...value };
    for (const [field, seed] of Object.entries(SEEDS[collection])) {
      if (
        value[field] === undefined ||
        baseline.fields[field] === hash(value[field])
      )
        next[field] = clone(seed);
    }
  }
  try {
    writeRaw(collection, next);
    window.localStorage.setItem(marker, "1");
  } catch {
    return next;
  }
  return next;
}
export function getCollection(collection) {
  if (!(collection in SEEDS)) throw new Error("Unknown content collection");
  if (typeof window === "undefined") return clone(SEEDS[collection]);
  const value = readRaw(collection);
  if (value === undefined) return clone(SEEDS[collection]);
  const expectedList = Array.isArray(SEEDS[collection]);
  if (
    value === null ||
    Array.isArray(value) !== expectedList ||
    (!expectedList && typeof value !== "object")
  )
    throw new Error("Saved content has an invalid format.");
  const next = clone(migrateV3(collection, migrate(collection, value)));
  return next;
}
export function setCollection(collection, value) {
  return persistCollection(collection, value);
}
export function resetCollection(collection) {
  return setCollection(collection, clone(SEEDS[collection]));
}
export function resetAll() {
  const resets = Object.keys(SEEDS).map(resetCollection);
  return resets;
}
export function exportContent() {
  const collections = Object.keys(SEEDS);
  const content = Object.fromEntries(
    collections.map((collection) => [collection, getCollection(collection)]),
  );
  const archived = readRaw("blog");
  if (archived !== undefined) content.archivedBlog = archived;
  return content;
}
function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
export function createListService(collection, idPrefix) {
  return {
    getSnapshot: () => getCollection(collection),
    list: async () => loadCollection(collection),
    getById: async (id) =>
      (await loadCollection(collection)).find((item) => item.id === id) || null,
    create: async (item) => {
      const newItem = { ...item, id: makeId(idPrefix) };
      await setCollection(collection, [
        ...(await loadCollection(collection)),
        newItem,
      ]);
      return newItem;
    },
    update: async (id, patch) => {
      let found = null;
      const updated = (await loadCollection(collection)).map((item) => {
        if (item.id === id) {
          found = { ...item, ...patch, id };
          return found;
        }
        return item;
      });
      if (!found)
        throw new Error("This item no longer exists. Reload and try again.");
      await setCollection(collection, updated);
      return found;
    },
    remove: async (id) => {
      await setCollection(
        collection,
        (await loadCollection(collection)).filter((item) => item.id !== id),
      );
      return true;
    },
  };
}
export function createObjectService(collection) {
  return {
    getSnapshot: () => getCollection(collection),
    get: async () => loadCollection(collection),
    update: async (patch) => {
      const updated = { ...(await loadCollection(collection)), ...patch };
      setCollection(collection, updated);
      return updated;
    },
  };
}
