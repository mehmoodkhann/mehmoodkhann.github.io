// Backend-ready shape: GET/POST /api/v1/expertise, PUT/DELETE /api/v1/expertise/{id}
// Powers both the public "AI Engineering Expertise" section and the
// admin "Services" management page (the category groupings are treated
// as the manageable "services/expertise areas" of the site).
import { createListService } from "./storage.js";
export const expertiseService = createListService("expertise", "exp");
