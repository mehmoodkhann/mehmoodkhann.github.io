// Backend-ready shape: GET /api/v1/settings, PUT /api/v1/settings
import { createObjectService } from "./storage.js";
export const settingsService = createObjectService("settings");
