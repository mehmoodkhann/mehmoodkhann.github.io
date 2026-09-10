// Backend-ready shape: GET/POST /api/v1/education, PUT/DELETE /api/v1/education/{id}
import { createListService } from "./storage.js";
export const educationService = createListService("education", "edu");
