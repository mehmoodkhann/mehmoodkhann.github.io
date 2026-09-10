# Mehmood Khan — AI Engineer & Intelligent Systems Builder

An upgrade of the existing React portfolio. The stack, service layer, local demo editor and content migration are retained. The site prioritizes AI projects and engineering case studies, with truthful BS Computer Science / QUEST / expected graduation 2027 positioning.

## Local setup

Use Node.js 22.12 or newer (the build was verified on Node 24.19). Extract the ZIP, open a terminal inside `MEHMOOD_KHAN_AI_ENGINEER_PORTFOLIO_FINAL`, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To stop the server, press Ctrl+C. No environment file is needed to view or edit the demo. The demo login at `/admin/login` uses `demo-admin` unless you set `VITE_ADMIN_PASSWORD`.

To configure contact delivery and the real public domain, copy the example first:

```bash
cp .env.example .env
```

Windows PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

Edit `.env` locally; do not commit it. Restart the dev server after changing environment values.

For production and regression checks:

```bash
npm run build
npm test
npm run preview
```

`npm run build` generates public HTML, metadata and assets in `dist/`. `npm test` requires that build first and covers source rendering, data services and generated routes; it does not run a browser. Use `npm ci` instead of `npm install` when you want an installation strictly from the lockfile.

## What changed

- New identity-led hero, with real-photo support on Home and About and real-link-only resume/social actions.
- Original technical covers for all three projects, with mobile variants; they are labelled diagrams, never fake screenshots.
- Stronger case-study structure: role, overview, problem, solution, architecture, full RAG pipeline, implementation, tools, decisions, contribution, value and limitations. Optional screenshots and external links render when supplied.
- Insights/blog removed. `/certifications` and its admin CRUD replace it. No credentials are invented; the homepage preview stays hidden while the collection is empty.
- Minimal public navigation, tablet/mobile menu, responsive admin cards, labelled forms, reduced-motion handling, and dark/light styling.
- New default-content migration preserves custom browser edits. Historical blog records remain in backups as `archivedBlog`.

Read `AUDIT.md` for the original pre-edit inventory, `DESIGN_REVIEW.md` for the follow-up design findings and implemented refinements, and `HANDOVER.md` for the complete change summary and validation limits.

## Add your real content

The editor changes only this browser. **Uploading a photo, resume or certificate in the editor does not publish it for other visitors.**

For shared static content:

1. Put your real portrait, screenshots, certificate images and PDF resume under `public/`. Optimize large photos before committing them; an approximately 1000px portrait is sufficient for this layout.
2. Edit `src/data/defaultData.js`: profile contact/social fields, `photoUrl`, `resumeUrl`, project source/demo URLs, and completed certifications. Use root-relative public paths such as `/images/mehmood-khan.webp`.
3. Rebuild and redeploy. The prerenderer uses this source data, including any new project IDs.

The admin is useful for drafting. Export its JSON backup from Settings and transfer the intended fields to `defaultData.js`. Keep personal message records out of published source. A real backend is required for shared online content editing; there is no automatic backup-import or publish button.

Certification records support `id`, `name`, `issuer`, `issueDate` (`YYYY-MM-DD`), `credentialId`, `credentialUrl`, `image`, and `skills` (array of strings). Use only credentials you actually hold. Add/edit/delete is available at `/admin/certifications`.

Project records support category, role, description, technologies, cover image/alt text, screenshots, architecture diagram URL, repository/demo/video URLs, featured status and the full structured case study. No empty media gallery or disabled source/demo action is shown.

## Environment values

| Variable                   | Purpose                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`            | Your real public origin, including `https://`. Enables canonical URLs, `og:url`, sitemap and the robots sitemap entry at build time. Leave blank until you know it. |
| `VITE_EMAILJS_SERVICE_ID`  | Your EmailJS service identifier.                                                                                                                                    |
| `VITE_EMAILJS_TEMPLATE_ID` | Your EmailJS template identifier.                                                                                                                                   |
| `VITE_EMAILJS_PUBLIC_KEY`  | Your EmailJS public browser key.                                                                                                                                    |
| `VITE_ADMIN_PASSWORD`      | Public demo gate only; defaults to `demo-admin`. Never use a real account password.                                                                                 |
| `VITE_API_BASE_URL`        | Reserved for a future backend; current services do not use it.                                                                                                      |

All `VITE_*` values are exposed in the browser build. Do not put Gemini, Qdrant, database, private EmailJS keys or any server secret here. The AI applications shown in case studies are not embedded in this portfolio.

EmailJS template fields are `from_name`, `from_email` and `message`; configure the recipient in your own EmailJS template. Without all three public EmailJS values, the form clearly saves a local draft only. A configured API acceptance produces a sent confirmation; failures preserve the entered text. No live test message was sent during this upgrade. Local message copies are per visitor/browser and are not a central inbox.

## Deploy to Vercel

The included `vercel.json` uses the existing Vite build, serves prerendered files first, falls back to the local admin application for admin routes, supports browser-created project URLs, and returns the custom 404 page for other missing routes. Keep this file; a blanket rewrite of every request to the homepage would undermine the prerendered pages.

1. Create a Git repository containing the extracted project, with `package.json` at its root. Commit the supplied source and lockfile. Do not commit `.env`, dependencies, `dist/`, private keys or local content backups.
2. In Vercel, choose **Add New → Project**, connect/import that repository, and select the directory containing `package.json` as the Root Directory. Use **Vite** as the framework.
3. Verify **Install Command** `npm ci`, **Build Command** `npm run build`, **Output Directory** `dist`, and a compatible Node version (22.12+; Node 24 was used here).
4. Under the project's environment variables, add your public EmailJS values if you want form delivery. Set `VITE_SITE_URL` to your actual production origin if already known. Keep the demo password non-sensitive.
5. Choose **Deploy**. If the domain was unknown, copy the actual production origin from the successful deployment, set `VITE_SITE_URL` for Production, and redeploy so metadata and the sitemap use it. For a custom domain, add it in Domains and use that final origin instead.
6. Check direct navigation/refresh on `/`, `/projects`, each project detail, `/about`, `/expertise`, `/services`, `/journey`, `/certifications`, `/contact`, `/admin/login` and `/admin/certifications`. Confirm that admin redirects to login in a clean browser, unknown URLs return 404, assets load, and `/sitemap.xml` contains the correct origin. Complete the viewport and contact-delivery checks in `HANDOVER.md` before launch.

These instructions follow [Vercel's Vite guide](https://vercel.com/docs/frameworks/frontend/vite), [environment-variable guidance](https://vercel.com/docs/environment-variables), and [filesystem/custom-404 routing guidance](https://vercel.com/kb/guide/custom-404-page). Environment changes apply to new deployments. No Vercel project or deployment was created during this upgrade.

## Architecture and future backend

`src/router/` defines the routes; `src/pages/`, `src/layouts/` and `src/components/` own presentation. `src/services/` separates persistence from UI. List services expose `list`, `getById`, `create`, `update`, `remove`, and `getSnapshot`; profile/settings use `get`, `update`, and `getSnapshot`.

The hidden navigation route is not a security boundary. Current login is Vite configuration plus a localStorage flag, and all content is browser-local. For a production CMS, replace the service implementations with a FastAPI API, enforce authentication/authorization on the server, store content in a database, and use file storage for uploads. Update or remove the synchronous snapshot path in `useCollection` when switching to remote data. Protect server operations; hiding an admin link alone is insufficient.

## ZIP contents

The deliverable includes source, static diagrams, tests, lockfile, configuration, `.env.example`, and documentation. It excludes `node_modules/`, `dist/`, `.env`, environment overrides, private credentials and temporary files. Build output is reproducible using the commands above.
