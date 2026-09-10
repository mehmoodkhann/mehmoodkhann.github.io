// Backend-ready shape: GET/POST /api/v1/journey, PUT/DELETE /api/v1/journey/{id}
import { createListService } from "./storage.js";
export const journeyService = createListService("journey", "jrny");
