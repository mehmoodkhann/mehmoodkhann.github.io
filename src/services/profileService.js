// Backend-ready shape: GET /api/v1/profile, PUT /api/v1/profile
import { createObjectService } from "./storage.js";
export const profileService = createObjectService("profile");
