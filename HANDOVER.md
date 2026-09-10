# Final V3 handover — design refinement

## Follow-up design review

The 9 September review refined the existing portfolio: a shorter flagship hero fallback, clickable project covers, a compact mobile case-study menu, clearer heading structure, larger reading text, tighter section spacing, more resilient navigation/footer layouts, and graceful presentation when optional content is missing. Existing project content, admin capabilities and dependencies are preserved. Read `DESIGN_REVIEW.md` for the prioritized findings and reasoning.

## Improvements delivered

| Area                  | Result                                                                                                                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Professional identity | Mehmood Khan / AI Engineer & Intelligent Systems Builder, with BS CS student, QUEST Nawabshah and expected graduation 2027 visible. No senior-employment or experience claims.                                                                           |
| Removed content       | Insights home block, blog/post public routes, admin blog page, blog service, unused Badge component, redundant hero technology strip and repeated per-service contact buttons. Historical browser articles remain exportable.                            |
| Added section         | Certifications page, conditional Home preview, complete credential model and admin CRUD. Empty by default; no invented awards or certificates.                                                                                                           |
| UX                    | Clear work/contact actions, valid-link-only social and resume actions, category and role hierarchy, case-study navigation and simpler secondary project presentation.                                                                                    |
| Responsive changes    | Desktop navigation starts at 1280px; compact menu below it. Hero stacks on phones, responsive SVG sources prevent cropping, tags and actions wrap, filter controls fit narrow screens, and admin tables become labelled cards.                           |
| Project presentation  | Three original technical covers plus mobile variants. Flagship AI project stays dominant. Repository/demo links now work on secondary cards too. No invented product screenshots or performance graphs.                                                  |
| Case studies          | Explicit role, contribution, decisions, module groups, RAG pipeline and evidence/limitations. Hugging Face supplies embeddings, Qdrant stores/retrieves vectors, Gemini generates, FastAPI serves the API, React provides the interface.                 |
| Skills and journey    | Core/Applied/Working Knowledge/Currently Learning/Exploring levels; no percentages. Programming category includes the user-supplied Python, C, C++, C#, SQL and Kotlin. Agentic workflows remain a learning area. No invented dates.                     |
| SEO                   | All 13 generated routes retain page-specific HTML/title/description and Open Graph/X text. `VITE_SITE_URL` controls canonical URLs and sitemap. SVG diagrams are omitted from social image tags. No unverified domain or new social image is fabricated. |
| Accessibility         | Label/control associations, descriptive image text, keyboard focus, menu Escape handling, dialog focus management, reduced-motion support and readable conditional/error states.                                                                         |
| Performance           | Original dependency versions and lockfile retained. Admin code remains lazy; image dimensions reserve layout space, below-fold media loads lazily, and diagrams are small vector assets. No extra runtime dependency added.                              |
| Admin                 | Certifications CRUD; project category/cover alt/limitations; profile hero fields, hosted/public photo and resume paths, upload/remove controls; responsive data tables; accurate demo/local notices; backups and migration preserved.                    |

## Validation completed

- Existing dependencies installed with the project dependency workflow. Vite dev server started successfully under the supported supervisor.
- `npm run build` completed, generating 13 route documents.
- `npm test`: **40 passing checks**. Covers generated route content/SEO/local assets, flagship tool relationships, Knowledge Assistant limitations, all list CRUD, certification fields, default migration/custom edit retention, storage failures, demo auth, contact validation, rendering of supplied portrait/resume/certificates/project links, heading order, the compact hero, and custom projects with or without covers.
- Static HTML inspection: 13 pages, no missing local links/assets, broken section anchors, duplicate IDs or missing image alt text.
- Public bundle approximately 388 kB / 118 kB gzip; CSS approximately 33.6 kB / 8.1 kB gzip. Framer Motion is in a separately loaded admin chunk of approximately 121 kB / 39 kB gzip. These are build sizes, not a Lighthouse score or real-world load-time benchmark.
- `npm run lint` exits successfully with 20 warnings about Fast Refresh exports and existing effect patterns; it reports no errors. These warnings remain documented maintenance work.
- Dependencies and package-lock are preserved. Source archive integrity and excluded files are checked before delivery.

## Validation limits

The internal browser preview URL was explicitly denied by browser policy in this conversation, including a prohibition on alternate browser access. The dev server starts, but **interactive browser, viewport, screenshot and console QA has not been completed**. Static tests are not a substitute for those checks. Asset diagrams were structurally checked; their raster preview tools were unavailable. No email was transmitted, no Vercel deployment was attempted, and the underlying AI projects were not executed.

Before launch, check these exact widths in your browser: **320, 360, 375, 390, 414, 480, 768, 820, 1024, 1280, 1440 and 1920 pixels**. At each width review Hero/photo, navbar/menu, project covers/cards, case-study section links and diagrams, skills, journey, certifications, services, contact/footer, and admin forms/tables. Confirm no page-level horizontal scrolling or clipped content, usable touch targets, keyboard focus, dark/light themes, and 200% text zoom. With reduced motion enabled, check the admin drawer/login as well as public transitions. On your own configured EmailJS service, verify one intentional contact submission and failure handling.

## Information still needed

1. Your real professional portrait. No portrait was uploaded; Hero currently shows a concise spotlight on the supplied Research Paper Assistant architecture and About omits the image. Both use the same profile photo as soon as one is added.
2. Your email, GitHub, LinkedIn, resume and real project repository/demo/video URLs. Missing actions stay hidden.
3. Any completed certifications with issuer/date/credential details and certificate image. The collection is intentionally empty.
4. Actual screenshots and the Intelligent Knowledge Assistant source. Its detailed implementation remains unverified, so missing evidence was not replaced with invented functionality.
5. The final public domain for `VITE_SITE_URL` and your own EmailJS public configuration if you want working email delivery.

## Local state and launch readiness

The portfolio source/build is complete within the available content. The photo integration, verified project evidence, real contact destinations and visual/browser QA still require the inputs/checks above.

Admin authentication is **local/demo only**. Anyone can inspect the Vite password or change a browser flag. Browser edits do not publish to visitors or synchronize across devices. For now, copy intended content edits into `src/data/defaultData.js`, place shared assets under `public/`, then rebuild/redeploy. Keep private messages and backups out of public source. Use a real FastAPI/auth/database/file-storage backend for shared online editing.

Exact setup and Vercel deployment steps are in `README.md`. No `.env`, credentials, generated build, dependencies or temporary files are included in `MEHMOOD_KHAN_AI_ENGINEER_PORTFOLIO_FINAL.zip`.
