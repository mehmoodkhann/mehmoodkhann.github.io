// EmailJS accepts a delivery request using the existing public configuration.
// Missing configuration returns sent:false. The contact form labels local drafts clearly.
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env?.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env?.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env?.VITE_EMAILJS_PUBLIC_KEY;

export const isEmailConfigured = Boolean(
  SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY,
);

export async function sendContactEmail({ name, email, message }) {
  if (!isEmailConfigured) {
    // Not configured yet — caller decides how to handle this (Contact.jsx
    // still saves the message locally either way).
    return { sent: false, reason: "not_configured" };
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { from_name: name, from_email: email, message },
    { publicKey: PUBLIC_KEY },
  );
  return { sent: true };
}
