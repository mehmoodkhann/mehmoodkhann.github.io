import { createListService } from "./storage.js";
// Future API: /api/v1/certifications and /api/v1/certifications/{id}.
export const certificationsService = createListService(
  "certifications",
  "cert",
);
