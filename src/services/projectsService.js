// Backend-ready shape: GET/POST /api/v1/projects, PUT/DELETE /api/v1/projects/{id}
import { createListService } from "./storage.js";
export const projectsService = createListService("projects", "proj");
