import {
  defaultProfile,
  defaultExpertise,
  defaultSkills,
  defaultProjects,
  defaultJourney,
  defaultEducation,
  defaultCertifications,
  defaultSettings,
  defaultServices,
} from "../data/defaultData.js";

const published = {
  profile: defaultProfile,
  expertise: defaultExpertise,
  skills: defaultSkills,
  projects: defaultProjects,
  journey: defaultJourney,
  education: defaultEducation,
  certifications: defaultCertifications,
  settings: defaultSettings,
  services: defaultServices,
};

const clone = (value) => JSON.parse(JSON.stringify(value));

function listService(collection) {
  return {
    getSnapshot: () => clone(published[collection]),
    list: async () => clone(published[collection]),
    getById: async (id) => {
      const item = published[collection].find((entry) => entry.id === id);
      return item ? clone(item) : null;
    },
  };
}

function objectService(collection) {
  return {
    getSnapshot: () => clone(published[collection]),
    get: async () => clone(published[collection]),
  };
}

export const profileService = objectService("profile");
export const settingsService = objectService("settings");
export const expertiseService = listService("expertise");
export const skillsService = listService("skills");
export const projectsService = listService("projects");
export const journeyService = listService("journey");
export const educationService = listService("education");
export const certificationsService = listService("certifications");
export const servicesService = listService("services");
