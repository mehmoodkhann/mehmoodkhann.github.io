// Backend-ready shape: GET /api/v1/messages, POST /api/v1/contact, DELETE /api/v1/messages/{id}
import { createListService } from "./storage.js";
const base = createListService("messages", "msg");

export const messagesService = {
  ...base,
  // A dedicated "submit" name reads better from the public Contact form
  // than the generic "create", while still hitting the same store.
  submit: async (payload) =>
    base.create({
      ...payload,
      receivedAt: new Date().toISOString(),
      read: false,
    }),
};
