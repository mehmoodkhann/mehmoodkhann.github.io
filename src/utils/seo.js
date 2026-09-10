import { webUrl } from "./links";
function meta(attribute, key, value) {
  let el = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
export function setPageMeta({
  title = "Mehmood Khan | AI Engineer & Intelligent Systems Builder",
  description = "Emerging AI engineer building document assistants and RAG applications.",
  noindex = false,
  image,
} = {}) {
  document.title = title;
  meta("name", "description", description);
  meta("property", "og:title", title);
  meta("property", "og:description", description);
  meta("name", "twitter:title", title);
  meta("name", "twitter:description", description);
  meta("property", "og:type", "website");
  meta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  const origin = webUrl(import.meta.env.VITE_SITE_URL);
  const canonical =
    origin && !noindex ? new URL(window.location.pathname, origin).href : "";
  meta("property", "og:url", canonical);
  let link = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  } else {
    link?.remove();
  }
  const resolvedImage =
    webUrl(image) ||
    (origin && image?.startsWith("/") ? new URL(image, origin).href : "");
  const resolved = /\.svg(?:[?#]|$)/i.test(resolvedImage) ? "" : resolvedImage;
  meta("property", "og:image", resolved);
  meta("name", "twitter:image", resolved);
  meta("name", "twitter:card", resolved ? "summary_large_image" : "summary");
}
