export function webUrl(value) {
  if (!value || /placeholder|example\.com|your[-_]/i.test(value)) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
export function emailAddress(value) {
  return typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !/placeholder|example\.com/i.test(value)
    ? value
    : "";
}
export function imageUrl(value) {
  return value?.startsWith("data:image/") ||
    (value?.startsWith("/") && !value.startsWith("//"))
    ? value
    : webUrl(value);
}
export function resumeUrl(value) {
  return value?.startsWith("data:application/pdf") ||
    (value?.startsWith("/") && !value.startsWith("//"))
    ? value
    : webUrl(value);
}
