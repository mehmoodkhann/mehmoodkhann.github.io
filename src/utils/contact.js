export function validateContact(form) {
  const clean = Object.fromEntries(
    ["name", "email", "message"].map((k) => [k, String(form[k] || "").trim()]),
  );
  const errors = {};
  if (!clean.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email))
    errors.email = "Please enter a valid email address.";
  if (!clean.message)
    errors.message = "Please describe what you would like to discuss.";
  if (clean.message.length > 5000)
    errors.message = "Please keep your message under 5,000 characters.";
  return { clean, errors };
}
