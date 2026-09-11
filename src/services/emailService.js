import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_67lu9mc";
const TEMPLATE_ID = "template_k2nupf8";
const PUBLIC_KEY = "gAeWT0Mx6P054e9HE";

emailjs.init({ publicKey: PUBLIC_KEY });

export function sendContactEmail(form) {
  return emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
}
