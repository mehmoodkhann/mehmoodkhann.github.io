# V3 upgrade audit and priorities

Audit date: 9 September 2026. Baseline: the previously upgraded React portfolio.

## Preserve

React 19, Vite, JavaScript, Tailwind, React Router, Framer Motion and the existing lockfile. Public/admin layouts, service APIs, localStorage namespace, content backups, contact delivery states, upload compression, theme preference, keyboard focus handling, and static prerendering are useful foundations.

## Inventory before changes

- Public routes: `/`, `/about`, `/expertise`, `/services`, `/projects`, `/projects/:id`, `/journey`, `/blog`, `/blog/:id`, `/contact`, and the not-found route.
- Admin routes: `/admin/login`, `/admin`, `/admin/dashboard`, `/admin/profile`, `/admin/projects`, `/admin/skills`, `/admin/journey`, `/admin/education`, `/admin/services`, `/admin/blog`, `/admin/messages`, `/admin/settings`.
- Ten content collections: profile/settings objects; projects, skills, expertise, services, journey, education, blog, messages lists. Service factories provide snapshots plus async CRUD; no shared backend exists.
- Home: Hero, FeaturedProjects, ExpertisePreview, JourneyPreview, ServicesPreview, InsightsPreview, ContactCta. Shared Navbar/Footer and semantic primitives. Projects have an interactive architecture explorer, pipeline and detailed case studies.
- Admin: shared list editor, project-specific editor, profile/photo/resume editor, messages and settings. Route gating uses a public Vite demo password and a browser flag.
- SEO: source-generated public HTML and metadata, optional canonical URLs/sitemap through `VITE_SITE_URL`, noindex admin, robots exclusion.
- Responsive CSS uses mobile grids, wrapping tags, a compact menu and admin drawer. Admin tables still force horizontal scrolling; the Work technology filter can overflow at narrow widths. Wide nav needs a later breakpoint after adding links. Motion preferences are covered in CSS but also need to be applied to Framer Motion.

## Findings and ordered changes

1. **Identity and clutter:** position Mehmood as AI Engineer & Intelligent Systems Builder while retaining BS CS student / QUEST / 2027. Remove the empty Insights/blog surfaces and redundant technology strip. Keep the home page focused on work.
2. **Project presentation:** all three covers are empty; secondary project rows have no cover or source/demo links. Add original, labelled technical diagrams and consistent media handling. Keep Hugging Face embeddings, Qdrant retrieval and Gemini generation correctly separated. Make role, decisions, value and limitations easy to scan.
3. **Certifications:** no collection, service, public page or admin editor exists. Add these with a deliberate empty state; never seed invented credentials.
4. **Admin completeness:** project category is not editable. Photo and resume need hosted/local URL inputs and removal controls; certification image upload is needed. Retain all required CRUD, make tables adapt to cards on phones, and preserve browser edits during migration.
5. **Validation and delivery:** update route tests and add meaningful migration/certification checks; production build; responsive QA where allowed; source-only ZIP excluding dependencies, build output and credentials. Document setup and Vercel deployment.

## Content and access limits identified before editing

No real portrait, resume, social/contact URLs, credentials, app screenshots or AI application repositories accompanied this brief. The Knowledge Assistant implementation remains unverified. Existing blog defaults are empty; any historical user-created browser articles must remain recoverable in backups even after removing the blog feature.

The earlier browser session explicitly blocked the internal preview URL by policy and forbade alternate access paths. That restriction is respected; do not describe static/build checks as browser or viewport testing.

## Reference review

The supplied [Martin Milton](https://martinmilton.cz/) and [Zavier Kamath](https://www.zavier-kamath.com/) pages were reviewed for case-study depth and clear paths to work/contact. [Sheraz Raza](https://sherazraza.me/) returned no readable page content. No reference text, code, imagery, personal details or branding is used in this project.
