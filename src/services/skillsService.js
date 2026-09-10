// Backend-ready shape: GET/POST /api/v1/skills, PUT/DELETE /api/v1/skills/{id}
import { createListService } from "./storage.js";
export const skillsService = createListService("skills", "skill");
