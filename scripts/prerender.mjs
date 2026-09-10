import { build, loadEnv } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const temp = path.join(root, ".prerender");
const template = await readFile(path.join(root, "dist/index.html"), "utf8");
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
try {
  await build({
    logLevel: "error",
    build: {
      ssr: "src/prerender.jsx",
      outDir: ".prerender",
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: "render.mjs" } },
    },
  });
  const { render, pages } = await import(
    pathToFileURL(path.join(temp, "render.mjs")).href
  );
  const env = loadEnv("production", root, "VITE_");
  let origin = "";
  if (env.VITE_SITE_URL) {
    const url = new URL(env.VITE_SITE_URL);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("VITE_SITE_URL must use https:// or http://");
    origin = url.origin;
  }
  for (const page of pages) {
    let html = template.replace(
      '<div id="root"></div>',
      () => `<div id="root">${render(page.path)}</div>`,
    );
    html = html.replace(
      /<title>[\s\S]*?<\/title>/,
      () => `<title>${esc(page.title)}</title>`,
    );
    const pairs = [
      ["name", "description", page.description],
      ["property", "og:title", page.title],
      ["property", "og:description", page.description],
      ["property", "og:type", page.type || "website"],
      ["name", "twitter:title", page.title],
      ["name", "twitter:description", page.description],
      ["name", "robots", page.noindex ? "noindex, nofollow" : "index, follow"],
    ];
    for (const [attr, key, value] of pairs) {
      const tag = `<meta ${attr}="${key}" content="${esc(value)}"/>`;
      const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`);
      html = html.replace(re, () => tag);
    }
    if (origin && !page.noindex) {
      const url = new URL(page.path, origin).href;
      html = html.replace(
        "</head>",
        `<link rel="canonical" href="${esc(url)}"/><meta property="og:url" content="${esc(url)}"/></head>`,
      );
    }
    if (
      page.image &&
      !page.image.startsWith("data:") &&
      !/\.svg(?:[?#]|$)/i.test(page.image) &&
      (origin || /^https?:/.test(page.image))
    ) {
      const src = new URL(page.image, origin || undefined).href;
      html = html.replace(
        /<meta name="twitter:card"[^>]*>/,
        '<meta name="twitter:card" content="summary_large_image"/>',
      );
      html = html.replace(
        "</head>",
        `<meta property="og:image" content="${esc(src)}"/><meta name="twitter:image" content="${esc(src)}"/></head>`,
      );
    }
    const dest =
      page.path === "/404"
        ? path.join(root, "dist/404.html")
        : path.join(root, "dist", page.path.slice(1), "index.html");
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, html);
  }
  if (origin) {
    const sitemap =
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      pages
        .filter((p) => !p.noindex)
        .map(
          (p) => `  <url><loc>${esc(new URL(p.path, origin).href)}</loc></url>`,
        )
        .join("\n") +
      "\n</urlset>\n";
    await writeFile("dist/sitemap.xml", sitemap);
    await writeFile(
      "dist/robots.txt",
      `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
    );
  }
  await writeFile(
    "dist/route-manifest.json",
    JSON.stringify(
      pages.map(({ path, title, noindex }) => ({
        path,
        title,
        noindex: !!noindex,
      })),
      null,
      2,
    ),
  );
  console.log(
    `Pre-rendered ${pages.length} routes with page-specific metadata.${origin ? " Sitemap generated." : " Set VITE_SITE_URL to enable canonical URLs and a sitemap."}`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
